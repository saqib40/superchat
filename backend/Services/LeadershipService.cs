// backend/Services/LeadershipService.cs

using Amazon.S3;
using backend.Config;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class LeadershipService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAmazonS3 _s3Client;
        private readonly EmailService _emailService;

        public LeadershipService(ApplicationDbContext context, IAmazonS3 s3Client)
        {
            _context = context;
            _s3Client = s3Client;
        }

        // New: Creates a new job with a specified country and assigns it to a list of vendors.
        public async Task<JobDto?> CreateJobAsync(CreateJobDto dto, int leaderUserId)
        {
            // Find the vendors based on the provided IDs and country.
            var vendors = await _context.Vendors
                .Where(v => dto.VendorIds.Contains(v.Id) && v.Country == dto.CountryCode)
                .ToListAsync();

            if (!vendors.Any())
            {
                return null; // Return null if no valid vendors were found for the country.
            }

            // Create the new job entity.
            var job = new Job
            {
                Title = dto.Title,
                Description = dto.Description,
                Country = dto.CountryCode,
                ExpiryDate = dto.ExpiryDate,
                CreatedByLeaderId = leaderUserId,
                CreatedAt = DateTime.UtcNow
            };

            // Create the many-to-many relationship entries.
            foreach (var vendor in vendors)
            {
                job.VendorAssignments.Add(new JobVendor { Vendor = vendor });
            }

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            // Return the newly created job as a DTO.
            return new JobDto(job.Id, job.Title, job.Description, job.CreatedAt, job.ExpiryDate);
        }

        // New: Retrieves all jobs created by a leader.
        public async Task<IEnumerable<JobDto>> GetJobsAsync(int leaderUserId)
        {
            return await _context.Jobs
                .Where(j => j.CreatedByLeaderId == leaderUserId)
                .Select(j => new JobDto(j.Id, j.Title, j.Description, j.CreatedAt, j.ExpiryDate))
                .ToListAsync();
        }

        // New: Retrieves a single job by its ID.
        public async Task<JobDto?> GetJobByIdAsync(int jobId)
        {
            return await _context.Jobs
                .Where(j => j.Id == jobId)
                .Select(j => new JobDto(j.Id, j.Title, j.Description, j.CreatedAt, j.ExpiryDate))
                .FirstOrDefaultAsync();
        }

        // New: Retrieves all employees for a specific job ID.
        public async Task<IEnumerable<EmployeeDto>> GetJobEmployeesAsync(int jobId)
        {
            // Use the Employee model's JobId foreign key to query.
            return await _context.Employees
                .Where(e => e.JobId == jobId)
                .Select(e => new EmployeeDto(e.Id, e.FirstName, e.LastName, e.JobTitle, e.JobId))
                .ToListAsync();
        }

        // New: Retrieves all vendors from a specific country.
        public async Task<IEnumerable<VendorDto>?> GetVendorsByCountryAsync(string countryCode)
        {
            var vendors = await _context.Vendors
                .Where(v => v.Country == countryCode)
                .Select(v => new VendorDto(v.Id, v.CompanyName, v.ContactEmail, v.Country, v.Status, v.CreatedAt, v.AddedByLeaderId))
                .ToListAsync();

            return vendors.Any() ? vendors : null;
        }

        // You'll need to define the following DTOs for the new methods to work.

        // public record JobDto(int Id, string Title, string Description, DateTime CreatedAt, DateTime ExpiryDate);
        // public class CreateJobDto
        // {
        //     public string Title { get; set; }
        //     public string Description { get; set; }
        //     public string CountryCode { get; set; }
        //     public DateTime ExpiryDate { get; set; }
        //     public List<int> VendorIds { get; set; }
        // }
        // Handles the creation of a new vendor with the new 'Country' field.
        public async Task<VendorDto?> CreateVendorAsync(string companyName, string contactEmail, string country, int addedByLeaderId)
        {
            var vendor = new Vendor
            {
                CompanyName = companyName,
                ContactEmail = contactEmail,
                Country = country, // Added the new 'Country' property
                Status = "PendingInvitation",
                VerificationToken = Guid.NewGuid(),
                TokenExpiry = DateTime.UtcNow.AddDays(7),
                AddedByLeaderId = addedByLeaderId, // Updated from AdminId to AddedByLeaderId
                CreatedAt = DateTime.UtcNow
            };

            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();

            await _emailService.SendInvitationEmailAsync(vendor.ContactEmail, vendor.VerificationToken.Value);

            return new VendorDto(vendor.Id, vendor.CompanyName, vendor.ContactEmail, vendor.Country, vendor.Status, vendor.CreatedAt, vendor.AddedByLeaderId);
        }
         // Retrieves a single vendor by their ID.
        public async Task<VendorDetailDto?> GetVendorByIdAsync(int vendorId)
        {
            return await _context.Vendors
                .Where(v => v.Id == vendorId)
                .Select(v => new VendorDetailDto(
                    v.Id,
                    v.CompanyName,
                    v.ContactEmail,
                    v.Status,
                    v.Employees.Select(e => new EmployeeDto(e.Id, e.FirstName, e.LastName, e.JobTitle, e.JobId)).ToList()
                ))
                .FirstOrDefaultAsync();
        }

    }
}