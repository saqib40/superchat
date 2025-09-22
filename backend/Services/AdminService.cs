using backend.Config;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;

namespace backend.Services
{
    public class AdminService
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;
        public AdminService(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // Handles the creation of a new vendor and kicks off the invitation process.
        public async Task<VendorDto?> CreateVendorAsync(string companyName, string contactEmail, int adminId)
        {
            // Create a new Vendor object in memory with the initial details.
            var vendor = new Vendor
            {
                CompanyName = companyName,
                ContactEmail = contactEmail,
                Status = "PendingInvitation", // The initial state for the approval workflow.
                VerificationToken = Guid.NewGuid(), // Generate a unique, unguessable token.
                TokenExpiry = DateTime.UtcNow.AddDays(7), // The token is valid for 1 week.
                AddedByAdminId = adminId, // Link this vendor to the admin who created them.
                CreatedAt = DateTime.UtcNow
            };

            // Add the new vendor to the DbContext's tracking system.
            _context.Vendors.Add(vendor);
            // SaveChangesAsync() commits the tracked changes to the actual database.
            await _context.SaveChangesAsync();

            // After successfully saving, send the invitation email with the verification token.
            await _emailService.SendInvitationEmailAsync(vendor.ContactEmail, vendor.VerificationToken.Value);

            // Return the newly created vendor object.
            return new VendorDto(vendor.Id, vendor.CompanyName, vendor.ContactEmail, vendor.Status, vendor.CreatedAt, vendor.AddedByAdminId);
        }

        // Approves a vendor who has submitted their details.
        public async Task<bool> ApproveVendorAsync(int vendorId)
        {
            // Find the vendor by their ID, but only if they are in the "PendingApproval" state.
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.Id == vendorId && v.Status == "PendingApproval");
            // Also ensure they have submitted a password. If not, something is wrong, so we fail.
            if (vendor == null || string.IsNullOrEmpty(vendor.PendingPasswordHash)) return false;
            
            // 1. Find the 'Vendor' role in the database.
            var vendorRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Vendor");
            if (vendorRole == null)
            {
                // Handle case where 'Vendor' role doesn't exist
                return false; 
            }
            // khud sai not tested
            if (vendor.TokenExpiry > DateTime.UtcNow)
            {
                return false;
            }
            // If the vendor is valid, create a new User account for them using the temporarily stored details.
            var user = new User
            {
                Email = vendor.ContactEmail,
                PasswordHash = vendor.PendingPasswordHash, // Use the pre-hashed password.
                FirstName = vendor.PendingFirstName,
                LastName = vendor.PendingLastName,
            };
            user.Roles.Add(vendorRole);
            _context.Users.Add(user);
            // Save the user to the database to generate their new ID.
            await _context.SaveChangesAsync();

            // Now, finalize the vendor's record.
            vendor.UserId = user.Id; // Link the new User ID to the Vendor.
            vendor.Status = "Verified"; // Update their status to show they are now an active vendor.
            
            // Clean up the temporary columns, as they are no longer needed.
            vendor.PendingFirstName = null;
            vendor.PendingLastName = null;
            vendor.PendingPasswordHash = null;
            
            // Save the final changes to the vendor record.
            await _context.SaveChangesAsync();
            return true;
        }
        
        // Rejects a vendor who is awaiting approval.
        public async Task<bool> RejectVendorAsync(int vendorId, string? reason)
        {
            // Find the vendor, ensuring they are in the correct "PendingApproval" state.
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.Id == vendorId && v.Status == "PendingApproval");
            if (vendor == null) return false;

            // Update the status to "Rejected".
            vendor.Status = "Rejected";
            
            // Clear out the sensitive pending data.
            vendor.PendingFirstName = null;
            vendor.PendingLastName = null;
            vendor.PendingPasswordHash = null;

            await _context.SaveChangesAsync();
            // Later we can add logic here to email the vendor about the rejection, possibly including the reason.
            return true;
        }

        // Retrieves a list of all vendors in the system.
        public async Task<IEnumerable<VendorDto>> GetAllVendorsAsync()
        {
            // A simple query to get all records from the Vendors table.
            return await _context.Vendors
                .Select(v => new VendorDto(v.Id, v.CompanyName, v.ContactEmail, v.Status, v.CreatedAt, v.AddedByAdminId))
                .ToListAsync();
        }

        // Retrieves a single vendor by their ID, including their list of employees.
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

        // Deletes a vendor from the database.
        public async Task<bool> DeleteVendorAsync(int vendorId)
        {
            // .FindAsync() is an efficient way to find an entity by its primary key.
            var vendor = await _context.Vendors.FindAsync(vendorId);
            // If the vendor doesn't exist, we can't delete it, so return false.
            if (vendor == null) return false;

            // Mark the vendor for deletion.
            _context.Vendors.Remove(vendor);
            // Commit the deletion to the database.
            await _context.SaveChangesAsync();
            return true;
        }
    }
}