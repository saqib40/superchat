using Amazon.S3;
using Amazon.S3.Model;
using backend.Config;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

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
            var vendorUser = await _context.Users.FirstOrDefaultAsync(u => u.PublicId == userPublicId);
            if (vendorUser == null) return null;
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == vendorUser.Id);
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.PublicId == dto.JobPublicId);
            if (vendor == null || job == null) return null;

            bool isAssigned = await _context.JobVendors.AnyAsync(jv => jv.JobId == job.Id && jv.VendorId == vendor.Id);
            if (!isAssigned) return null;

            // Optional: Validate that the job exists and is assigned to this vendor.
            var jobAssignment = await _context.JobVendors
                .FirstOrDefaultAsync(jv => jv.JobId == dto.JobId && jv.VendorId == vendor.Id);

            if (jobAssignment == null)
            {
                // This vendor is not assigned to this job.
                return null;
            }

            string? resumeS3Key = null;
            if (dto.ResumeFile != null)
            {
                resumeS3Key = $"resumes/job-{job.PublicId}/{Guid.NewGuid()}-{dto.ResumeFile.FileName}";
                var putRequest = new PutObjectRequest
                {
                    BucketName = Environment.GetEnvironmentVariable("S3_BUCKET"),
                    Key = resumeS3Key,
                    InputStream = dto.ResumeFile.OpenReadStream(),
                    ContentType = dto.ResumeFile.ContentType
                };
                await _s3Client.PutObjectAsync(putRequest);
            }

            var employee = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                JobTitle = dto.JobTitle,
                ResumeS3Key = resumeS3Key,
                VendorId = vendor.Id,
                JobId = job.Id,
                CreatedByUserId = vendorUser.Id
            };

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
            await _context.SaveChangesAsync();
            return true;
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

        public async Task<IEnumerable<EmployeeDto>> GetMyEmployeesForJobAsync(Guid jobPublicId, Guid userPublicId)
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.User.PublicId == userPublicId);
            if(vendor == null) return Enumerable.Empty<EmployeeDto>();

            return await _context.Employees
                .Where(e => e.Job.PublicId == jobPublicId && e.VendorId == vendor.Id)
                .Select(e => new EmployeeDto(e.PublicId, e.FirstName, e.LastName, e.JobTitle))
                .ToListAsync();
        }

        // New method to get all jobs assigned to the current vendor.
        public async Task<IEnumerable<JobDto>> GetAssignedJobsAsync(int vendorUserId)
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == vendorUserId);
            if (vendor == null) return new List<JobDto>();

            // Eager load the JobAssignments and then the related Job for the current vendor.
            return await _context.JobVendors
                .Where(jv => jv.VendorId == vendor.Id)
                .Select(jv => new JobDto(jv.Job.Id, jv.Job.Title, jv.Job.Country, jv.Job.CreatedAt, jv.Job.ExpiryDate, jv.Job.IsActive))
                .ToListAsync();
        }
    }
}

