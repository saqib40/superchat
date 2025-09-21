using Amazon.S3;
using Amazon.S3.Model;
using backend.Config;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;

namespace backend.Services
{
    public class LeadershipService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAmazonS3 _s3Client;
        public LeadershipService(ApplicationDbContext context, IAmazonS3 s3Client)
        {
            _context = context;
            _s3Client = s3Client;
        }

        // Provides a generic search capability across different entity types (vendors or employees).
        public async Task<SearchResultDto> SearchAsync(string type, string query)
        {
            // Basic validation to prevent empty searches.
            if (string.IsNullOrWhiteSpace(query))
                return null;

            // Check the 'type' parameter to determine which table to search.
            // StringComparison.OrdinalIgnoreCase makes the check case-insensitive (e.g., "vendor" or "Vendor").
            if (type.Equals("vendor", StringComparison.OrdinalIgnoreCase))
            {
                // Use Entity Framework Core's LINQ capabilities to query the database.
                // .Where() filters the records. .Contains() translates to a 'LIKE %...%' SQL query.
                var results = await _context.Vendors
                    .Where(v => v.CompanyName.Contains(query))
                    .Select(v => new VendorDto(v.Id, v.CompanyName, v.ContactEmail, v.Status, v.CreatedAt, v.AddedByAdminId))
                    .ToListAsync<object>();
                return new SearchResultDto("Vendor", results);
            }
            if (type.Equals("employee", StringComparison.OrdinalIgnoreCase))
            {
                // Here, we search by concatenating the first and last names.
                var results = await _context.Employees
                    .Where(e => (e.FirstName + " " + e.LastName).Contains(query))
                    .Select(e => new EmployeeDto(e.Id, e.FirstName, e.LastName, e.JobTitle))
                    .ToListAsync<object>();
                return new SearchResultDto("Employee", results);
            }

            // If the 'type' is not recognized, return null.
            return null;
        }

        // Fetches all vendor data for the main leadership dashboard.
        public async Task<IEnumerable<VendorDto>> GetDashboardAsync()
        {
            // .Include(v => v.Employees) is called "eager loading".
            // It tells EF Core to fetch all vendors AND their related employees in a single, efficient database query.
            return await _context.Vendors
                .Select(v => new VendorDto(v.Id, v.CompanyName, v.ContactEmail, v.Status, v.CreatedAt, v.AddedByAdminId))
                .ToListAsync();
        }

        // Retrieves a single vendor by their ID, including all their associated employees.
        public async Task<VendorDetailDto?> GetVendorByIdAsync(int vendorId)
        {
            return await _context.Vendors
                .Where(v => v.Id == vendorId)
                .Select(v => new VendorDetailDto(
                    v.Id,
                    v.CompanyName,
                    v.ContactEmail,
                    v.Status,
                    v.Employees.Select(e => new EmployeeDto(e.Id, e.FirstName, e.LastName, e.JobTitle)).ToList()
                ))
                .FirstOrDefaultAsync();
        }

        // Retrieves a single employee's details and generates a secure, temporary link to their resume.
        public async Task<EmployeeDetailDto?> GetEmployeeByIdAsync(int vendorId, int employeeId)
        {
            // Query for the employee, ensuring they belong to the specified vendor for security.
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == employeeId && e.VendorId == vendorId);

            // If no employee is found, return null.
            if (employee == null) return null;

            string? resumeUrl = null;
            // Check if a resume key exists in the database for this employee.
            if (!string.IsNullOrEmpty(employee.ResumeS3Key))
            {
                // If it exists, call our helper method to generate the secure download link.
                resumeUrl = GeneratePresignedUrl(employee.ResumeS3Key);
            }

            return new EmployeeDetailDto(employee.Id, employee.FirstName, employee.LastName, employee.JobTitle, employee.VendorId, resumeUrl);
        }

        // This private helper method generates a secure, temporary URL for a private S3 object.
        private string GeneratePresignedUrl(string key)
        {
            var request = new GetPreSignedUrlRequest
            {
                // The name of the S3 bucket, read from our environment configuration.
                BucketName = Environment.GetEnvironmentVariable("S3_BUCKET"),
                // The unique identifier for the file within the bucket.
                Key = key,
                // The URL will automatically expire after this time, enhancing security.
                Expires = DateTime.UtcNow.AddMinutes(5)
            };
            // The S3 client handles the complex cryptographic signing process and returns the final URL.
            return _s3Client.GetPreSignedURL(request);
        }
    }
}