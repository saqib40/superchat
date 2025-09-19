using Amazon.S3;
using Amazon.S3.Model;
using backend.Config;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Controllers;

namespace backend.Services
{
    public class VendorService
    {
        // Private fields to hold the injected dependencies.
        private readonly ApplicationDbContext _context;
        private readonly IAmazonS3 _s3Client;

        // The constructor uses Dependency Injection to receive the database context and S3 client.
        public VendorService(ApplicationDbContext context, IAmazonS3 s3Client)
        {
            _context = context;
            _s3Client = s3Client;
        }

        // Retrieves all employees that belong to the currently logged-in vendor.
        public async Task<IEnumerable<Employee>> GetEmployeesAsync(int vendorUserId)
        {
            // First, find the Vendor record associated with the logged-in user's ID.
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == vendorUserId);
            // If for some reason the user isn't linked to a vendor, return an empty list.
            if (vendor == null) return new List<Employee>();

            // Return all employees whose VendorId matches the found vendor's ID.
            return await _context.Employees
                .Where(e => e.VendorId == vendor.Id)
                .ToListAsync();
        }

        // Retrieves a single employee by their ID, ensuring they belong to the logged-in vendor.
        public async Task<Employee?> GetEmployeeByIdAsync(int employeeId, int vendorUserId)
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == vendorUserId);
            if (vendor == null) return null;

            // This query is crucial for security: it checks both the employee's ID AND that their
            // VendorId matches the logged-in vendor's ID. This prevents one vendor from accessing another's employees.
            return await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == employeeId && e.VendorId == vendor.Id);
        }

        // Creates a new employee and uploads their resume to S3 if provided.
        public async Task<Employee?> CreateEmployeeAsync(CreateEmployeeDto dto, int vendorUserId)
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == vendorUserId);
            if (vendor == null) return null;

            string? resumeS3Key = null;
            // Check if a resume file was included in the request.
            if (dto.ResumeFile != null)
            {
                // Generate a unique key (file path) for the S3 object to prevent name collisions.
                // A good practice is to include IDs in the path.
                resumeS3Key = $"resumes/vendor-{vendor.Id}/{Guid.NewGuid()}-{dto.ResumeFile.FileName}";
                
                // Prepare the upload request for the AWS SDK.
                var putRequest = new PutObjectRequest
                {
                    BucketName = Environment.GetEnvironmentVariable("S3_BUCKET"),
                    Key = resumeS3Key,
                    InputStream = dto.ResumeFile.OpenReadStream(), // The actual file content.
                    ContentType = dto.ResumeFile.ContentType
                };

                // Asynchronously upload the file to S3.
                await _s3Client.PutObjectAsync(putRequest);
            }

            // Create the new Employee entity in memory.
            var employee = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                JobTitle = dto.JobTitle,
                ResumeS3Key = resumeS3Key, // Store the S3 key, not the file itself.
                VendorId = vendor.Id,
                CreatedByUserId = vendorUserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        // Updates an existing employee's details.
        public async Task<Employee?> UpdateEmployeeAsync(int employeeId, UpdateEmployeeDto dto, int vendorUserId)
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == vendorUserId);
            if (vendor == null) return null;

            // Find the specific employee, ensuring they belong to the correct vendor.
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == employeeId && e.VendorId == vendor.Id);
            if (employee == null) return null;

            // Update the employee's properties with the new values from the DTO.
            employee.FirstName = dto.FirstName;
            employee.LastName = dto.LastName;
            employee.JobTitle = dto.JobTitle;
            employee.UpdatedAt = DateTime.UtcNow;
            employee.UpdatedByUserId = vendorUserId;

            // Commit the changes to the database.
            await _context.SaveChangesAsync();
            return employee;

            // will add later
            // support for updating the resume
        }

        // Deletes an employee record.
        public async Task<bool> DeleteEmployeeAsync(int employeeId, int vendorUserId)
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == vendorUserId);
            if (vendor == null) return false;

            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == employeeId && e.VendorId == vendor.Id);
            if (employee == null) return false;

            // Mark the employee for deletion.
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            // This only deletes the database record. For a complete cleanup, you could
            // add logic here to also delete the associated resume file from the S3 bucket
            // using the employee.ResumeS3Key.

            return true;
        }
    }
}