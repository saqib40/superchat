using Amazon.S3;
using Amazon.S3.Model;
using backend.Config;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Enums;

namespace backend.Services
{
    public class VendorService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAmazonS3 _s3Client;

        public VendorService(ApplicationDbContext context, IAmazonS3 s3Client)
        {
            _context = context;
            _s3Client = s3Client;
        }

        public async Task<EmployeeDto?> CreateEmployeeAsync(CreateEmployeeRequest dto, Guid userPublicId)
        {
            if (dto.ResumeFile == null || dto.ResumeFile.Length == 0)
            {
                return null; 
            }
            const long maxFileSize = 5 * 1024 * 1024; // 5 MB
            if (dto.ResumeFile.Length > maxFileSize)
            {
                return null;
            }
            var allowedContentTypes = new[] { "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }; // PDF and DOCX
            if (!allowedContentTypes.Contains(dto.ResumeFile.ContentType))
            {
                return null;
            }
            var emailExistsInUsers = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            var emailExistsInEmployees = await _context.Employees.IgnoreQueryFilters().AnyAsync(e => e.Email == dto.Email);
            if (emailExistsInUsers || emailExistsInEmployees)
            {
                return null;
            }
            var vendorUser = await _context.Users.FirstOrDefaultAsync(u => u.PublicId == userPublicId);
            if (vendorUser == null) return null;
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == vendorUser.Id);
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.PublicId == dto.JobPublicId);
            if (vendor == null || job == null) return null;

            bool isAssigned = await _context.JobVendors.AnyAsync(jv => jv.JobId == job.Id && jv.VendorId == vendor.Id);
            if (!isAssigned) return null;

            string resumeS3Key = $"resumes/job-{job.PublicId}/{Guid.NewGuid()}-{dto.ResumeFile.FileName}";
            var putRequest = new PutObjectRequest
            {
                BucketName = Environment.GetEnvironmentVariable("S3_BUCKET"),
                Key = resumeS3Key,
                InputStream = dto.ResumeFile.OpenReadStream(),
                ContentType = dto.ResumeFile.ContentType
            };
            await _s3Client.PutObjectAsync(putRequest);

            var employee = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                JobTitle = dto.JobTitle,
                PhoneNumber = dto.PhoneNumber,
                YearsOfExperience = dto.YearsOfExperience,
                Skills = dto.Skills,
                ResumeS3Key = resumeS3Key, // This is now guaranteed to exist.
                VendorId = vendor.Id,
                JobId = job.Id,
                CreatedByUserId = vendorUser.Id
            };

            // After creating an employee, we now create the application link with a 'Submitted' status.
            var jobApplication = new JobApplication
            {
                Job = job,
                Employee = employee,
                Status = ApplicationStatus.Submitted,
                LastUpdatedAt = DateTime.UtcNow
            };
            _context.JobApplications.Add(jobApplication);

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return new EmployeeDto(employee.PublicId, employee.FirstName, employee.LastName, employee.JobTitle);
        }

        public async Task<bool> SoftDeleteEmployeeAsync(Guid publicId, Guid userPublicId)
        {
            var employee = await _context.Employees.IgnoreQueryFilters()
                .Include(e => e.Vendor.User)
                .FirstOrDefaultAsync(e => e.PublicId == publicId && e.Vendor.User.PublicId == userPublicId);

            if (employee == null) return false;

            employee.IsActive = false;

            // Find all applications for this employee and mark them as Rejected,
            // as the candidate has been withdrawn by the vendor.
            var applications = await _context.JobApplications
                .Where(app => app.EmployeeId == employee.Id)
                .ToListAsync();

            foreach (var app in applications)
            {
                app.Status = ApplicationStatus.Rejected;
                app.Feedback = "Candidate withdrawn by vendor.";
                app.LastUpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }
        
        // Gets a detailed view of a single job assigned to the vendor, including the status of all their submitted candidates.
        public async Task<VendorJobDetailDto?> GetMyAssignedJobDetailsAsync(Guid jobPublicId, Guid userPublicId)
        {
            var vendor = await _context.Vendors.AsNoTracking().FirstOrDefaultAsync(v => v.User.PublicId == userPublicId);
            if (vendor == null) return null;

            return await _context.Jobs
                .Where(j => j.PublicId == jobPublicId && j.VendorAssignments.Any(va => va.VendorId == vendor.Id))
                .Select(job => new VendorJobDetailDto(
                    job.PublicId,
                    job.Title,
                    job.Description,
                    job.Country,
                    job.ExpiryDate,
                    // Get all applications for this job submitted ONLY by the current vendor
                    _context.JobApplications
                        .Where(app => app.JobId == job.Id && app.Employee.VendorId == vendor.Id)
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
                        )).ToList()
                ))
                .FirstOrDefaultAsync();
        }   

        public async Task<IEnumerable<JobDto>> GetMyAssignedJobsAsync(Guid userPublicId)
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.User.PublicId == userPublicId);
            if (vendor == null) return Enumerable.Empty<JobDto>();

            return await _context.JobVendors
                .Where(jv => jv.VendorId == vendor.Id)
                .Select(jv => jv.Job)
                .Select(j => new JobDto(j.PublicId, j.Title, j.Country, j.CreatedAt, j.ExpiryDate, (j.ExpiryDate - DateTime.UtcNow).TotalDays))
                .ToListAsync();
        }

    }
}

