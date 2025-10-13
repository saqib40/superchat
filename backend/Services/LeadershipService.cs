using backend.Config;
using backend.DTOs;
using backend.Models;
using backend.Enums;
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
            var emailExistsInUsers = await _context.Users.AnyAsync(u => u.Email == dto.ContactEmail);
            var emailExistsInEmployees = await _context.Employees.IgnoreQueryFilters().AnyAsync(e => e.Email == dto.ContactEmail);

            if (emailExistsInUsers || emailExistsInEmployees)
            {
                return null;
            }
            var vendorRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Vendor");
            if (vendorRole == null) return null;

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
            var vendor = await _context.Vendors
                .Include(v => v.User)
                .Include(v => v.Employees)
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(v => v.PublicId == publicId);
            if (vendor == null) return false;
            
            vendor.IsActive = false;
            
            if (vendor.User != null)
            {
                vendor.User.IsActive = false;
            }
            
            foreach (var employee in vendor.Employees)
            {
                employee.IsActive = false;
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
                Status = JobStatus.Open
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
                    j.Status,
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
                .Include(e => e.Vendor)
                .Where(e => e.PublicId == publicId)
                .Select(e => new 
                {
                    e.PublicId,
                    e.FirstName,
                    e.LastName,
                    e.JobTitle,
                    e.Email,
                    e.PhoneNumber,
                    e.YearsOfExperience,
                    e.Skills,
                    e.CreatedAt,
                    e.Vendor.CompanyName,
                    e.ResumeS3Key
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
                    Expires = DateTime.UtcNow.AddMinutes(15)
                };
                resumeUrl = _s3Client.GetPreSignedURL(request);
            }
            return new EmployeeDetailDto(
                employee.PublicId,
                employee.FirstName,
                employee.LastName,
                employee.JobTitle,
                employee.Email,
                employee.PhoneNumber,
                employee.YearsOfExperience,
                employee.Skills,
                employee.CreatedAt,
                employee.CompanyName,
                resumeUrl
            );
        }

        public async Task<bool> SoftDeleteJobAsync(Guid publicId)
        {
            var job = await _context.Jobs
                .Include(j => j.VendorAssignments)
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(j => j.PublicId == publicId);

            if (job == null) return false;

            job.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<JobApplicationDto>> GetApplicationsForJobAsync(Guid jobPublicId, int leaderId, ApplicationStatus? statusFilter = null)
        {
            var query = _context.JobApplications
                .Where(app => app.Job.PublicId == jobPublicId && app.Job.CreatedByLeaderId == leaderId);

            if (statusFilter.HasValue)
            {
                query = query.Where(app => app.Status == statusFilter.Value);
            }

            return await query.Select(app => new JobApplicationDto(
                    app.PublicId,
                    app.Status,
                    app.LastUpdatedAt,
                    app.Feedback,
                    app.Employee.PublicId,
                    app.Employee.FirstName,
                    app.Employee.LastName,
                    app.Employee.Email,
                    app.Job.PublicId,
                    app.Job.Title
                ))
                .ToListAsync();
        }
        
        public async Task<IEnumerable<JobApplicationDto>> GetHiredApplicationsForLeaderAsync(int leaderId)
        {
            return await _context.JobApplications
                .Where(app => app.Job.CreatedByLeaderId == leaderId &&
                               app.Status == ApplicationStatus.Hired)
                .Select(app => new JobApplicationDto(
                    app.PublicId,
                    app.Status,
                    app.LastUpdatedAt,
                    app.Feedback,
                    app.Employee.PublicId,
                    app.Employee.FirstName,
                    app.Employee.LastName,
                    app.Employee.Email,
                    app.Job.PublicId,
                    app.Job.Title
                ))
                .ToListAsync();
        }

        public async Task<bool> UpdateApplicationStatusAsync(Guid applicationPublicId, ApplicationStatus newStatus, int leaderId)
        {
            var application = await _context.JobApplications
                .Include(app => app.Job)
                .FirstOrDefaultAsync(app => app.PublicId == applicationPublicId);

            if (application == null || application.Job.CreatedByLeaderId != leaderId)
            {
                return false;
            }

            application.Status = newStatus;
            application.LastUpdatedAt = DateTime.UtcNow;

            if (newStatus == ApplicationStatus.Hired)
            {
                application.Job.Status = JobStatus.Closed;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddFeedbackToApplicationAsync(Guid applicationPublicId, string feedback, int leaderId)
        {
            var application = await _context.JobApplications
                .Include(app => app.Job)
                .FirstOrDefaultAsync(app => app.PublicId == applicationPublicId);

            if (application == null || application.Job.CreatedByLeaderId != leaderId)
            {
                return false;
            }

            application.Feedback = feedback;
            application.LastUpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateJobStatusAsync(Guid jobPublicId, JobStatus newStatus, int leaderId)
        {
            var job = await _context.Jobs
                .FirstOrDefaultAsync(j => j.PublicId == jobPublicId);

            if (job == null || job.CreatedByLeaderId != leaderId)
            {
                return false;
            }

            job.Status = newStatus;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}