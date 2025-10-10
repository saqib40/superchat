using backend.Config;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Amazon.S3.Model;
using Amazon.S3;

namespace backend.Services
{
    public class LeadershipService
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;
        private readonly IAmazonS3 _s3Client;

        public LeadershipService(ApplicationDbContext context, EmailService emailService, IAmazonS3 s3Client)
        {
            _context = context;
            _emailService = emailService;
            _s3Client = s3Client;
        }

        public async Task<VendorDto?> CreateVendorAsync(CreateVendorRequest dto, int leaderId)
        {
            var vendorRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Vendor");
            if (vendorRole == null) return null;

            // Create a User shell with a placeholder password. The vendor will set their own.
            var newUser = new User { Email = dto.ContactEmail, PasswordHash = "SETUP_PENDING", AddedById = leaderId };
            newUser.Roles.Add(vendorRole);
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var newVendor = new Vendor
            {
                CompanyName = dto.CompanyName,
                ContactEmail = dto.ContactEmail,
                Country = dto.Country,
                Status = "Pending Setup",
                VerificationToken = Guid.NewGuid(),
                TokenExpiry = DateTime.UtcNow.AddDays(7),
                AddedById = leaderId,
                UserId = newUser.Id
            };
            _context.Vendors.Add(newVendor);
            await _context.SaveChangesAsync();

            await _emailService.SendInvitationEmailAsync(newVendor.ContactEmail, newVendor.VerificationToken.Value);

            return new VendorDto(newVendor.PublicId, newVendor.CompanyName, newVendor.ContactEmail, newVendor.Country, newVendor.Status);
        }

        public async Task<bool> SoftDeleteVendorAsync(Guid publicId)
        {
            var vendor = await _context.Vendors.IgnoreQueryFilters().FirstOrDefaultAsync(v => v.PublicId == publicId);
            if (vendor == null) return false;

            vendor.IsActive = false;
            if (vendor.UserId.HasValue)
            {
                var user = await _context.Users.IgnoreQueryFilters().FirstOrDefaultAsync(u => u.Id == vendor.UserId);
                if (user != null) user.IsActive = false;
            }
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<JobDto?> CreateJobAsync(CreateJobRequest dto, int leaderId)
        {
            var assignedVendors = await _context.Vendors
                .Where(v => dto.AssignedVendorPublicIds.Contains(v.PublicId) && v.Country == dto.Country)
                .ToListAsync();

            if (!assignedVendors.Any()) return null;

            var newJob = new Job
            {
                Title = dto.Title,
                Description = dto.Description,
                Country = dto.Country,
                ExpiryDate = dto.ExpiryDate,
                CreatedByLeaderId = leaderId,
            };

            foreach (var vendor in assignedVendors)
            {
                newJob.VendorAssignments.Add(new JobVendor { Vendor = vendor });
            }
            _context.Jobs.Add(newJob);
            await _context.SaveChangesAsync();

            return new JobDto(newJob.PublicId, newJob.Title, newJob.Country, newJob.CreatedAt, newJob.ExpiryDate, (newJob.ExpiryDate - DateTime.UtcNow).TotalDays);
        }

        public async Task<IEnumerable<VendorDto>> GetVendorsByCountryAsync(string country)
        {
            return await _context.Vendors
                .Where(v => v.Country == country)
                .Select(v => new VendorDto(v.PublicId, v.CompanyName, v.ContactEmail, v.Country, v.Status))
                .ToListAsync();
        }

        public async Task<IEnumerable<JobDto>> GetMyCreatedJobsAsync(int leaderId)
        {
            return await _context.Jobs
               .Where(j => j.CreatedByLeaderId == leaderId)
               .Select(j => new JobDto(j.PublicId, j.Title, j.Country, j.CreatedAt, j.ExpiryDate, (j.ExpiryDate - DateTime.UtcNow).TotalDays))
               .ToListAsync();
        }

        public async Task<JobDetailDto?> GetJobByPublicIdAsync(Guid publicId)
        {
            return await _context.Jobs
                .Where(j => j.PublicId == publicId)
                .Select(j => new JobDetailDto(
                    j.PublicId,
                    j.Title,
                    j.Description,
                    j.Country,
                    j.ExpiryDate,
                    new UserDto(j.CreatedByLeader.PublicId, j.CreatedByLeader.Email, j.CreatedByLeader.FirstName, j.CreatedByLeader.LastName),
                    j.VendorAssignments.Select(va => new VendorDto(va.Vendor.PublicId, va.Vendor.CompanyName, va.Vendor.ContactEmail, va.Vendor.Country, va.Vendor.Status)).ToList(),
                    j.Employees.Select(e => new EmployeeWithVendorDto(
                        e.PublicId,
                        e.FirstName,
                        e.LastName,
                        e.JobTitle,
                        e.Vendor.CompanyName
                    )).ToList()
                ))
                .FirstOrDefaultAsync();
        }

        public async Task<EmployeeDetailDto?> GetEmployeeDetailsAsync(Guid publicId)
        {
            var employee = await _context.Employees
                .Include(e => e.Vendor) // Include Vendor to get the company name
                .Where(e => e.PublicId == publicId)
                .Select(e => new
                {
                    e.PublicId,
                    e.FirstName,
                    e.LastName,
                    e.JobTitle,
                    e.CreatedAt,
                    e.Vendor.CompanyName,
                    e.ResumeS3Key // We need the S3 key to generate the URL
                })
                .FirstOrDefaultAsync();

            if (employee == null) return null;

            string? resumeUrl = null;
            if (!string.IsNullOrEmpty(employee.ResumeS3Key))
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = Environment.GetEnvironmentVariable("S3_BUCKET"),
                    Key = employee.ResumeS3Key,
                    Expires = DateTime.UtcNow.AddMinutes(15) // The URL will be valid for 15 minutes
                };
                resumeUrl = _s3Client.GetPreSignedURL(request);
            }

            return new EmployeeDetailDto(
                employee.PublicId,
                employee.FirstName,
                employee.LastName,
                employee.JobTitle,
                employee.CreatedAt,
                employee.CompanyName,
                resumeUrl
            );
        }
        // --- NEW METHOD FOR UPDATING EMPLOYEE STATUS ---
        public async Task<bool> UpdateEmployeeStatusAsync(Guid publicId, string newStatus, int leaderId)
        {
            // 1. Validate the incoming status against the list of valid statuses a leader can set.
            var validLeaderStatuses = new List<string> { "Under Review", "Shortlisted", "Hired", "Rejected" };
            if (!validLeaderStatuses.Contains(newStatus))
            {
                return false; // The status is not a valid one.
            }

            // 2. Find the employee in the database and include their related Job.
            // We need the Job object to update its status if the employee is hired.
            var employee = await _context.Employees
                .Include(e => e.Job) // Eagerly load the related Job
                .FirstOrDefaultAsync(e => e.PublicId == publicId);

            if (employee == null)
            {
                return false; // The employee was not found.
            }

            // 3. Update the employee's status and the audit fields.
            employee.Status = newStatus;
            employee.UpdatedByUserId = leaderId;
            employee.UpdatedAt = DateTime.UtcNow;

            // 4. Handle the "Hired" side-effect based on our design.
            if (newStatus == "Hired")
            {
                // If the employee is hired, we automatically close the associated job.
                // This is a great example of business logic automation.
                if (employee.Job != null)
                {
                    employee.Job.Status = "Closed";
                }
            }

            // 5. Save all the changes (to both the Employee and potentially the Job) to the database.
            await _context.SaveChangesAsync();

            return true;
        }
    }
}

