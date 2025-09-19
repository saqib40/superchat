using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    // DTOs (Data Transfer Objects) are defined here as 'records' for simplicity.
    // They define the expected shape of the JSON request bodies for creating and rejecting vendors.
    public record CreateVendorRequest(string CompanyName, string ContactEmail);
    public record RejectVendorRequest(string? Reason);

    [ApiController] // Enables standard API behaviors.
    [Route("api/[controller]")] // Sets the base route to /api/admin.
    [Authorize(Roles = "Admin")] // Secures ALL endpoints in this controller, allowing access only to users with the "Admin" role.
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;
        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        // creating a new vendor.
        // POST /api/admin/vendors
        [HttpPost("vendors")]
        public async Task<IActionResult> CreateVendor([FromBody] CreateVendorRequest request)
        {
            // Get the ID of the currently logged-in admin from their JWT claims.
            // This ensures we can track who created the vendor.
            var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            
            // Delegate the creation logic to the service.
            var vendor = await _adminService.CreateVendorAsync(request.CompanyName, request.ContactEmail, adminId);
            
            // Return a 201 Created response. This is a RESTful best practice.
            // It includes a "Location" header pointing to the new resource's URL and the new vendor object in the body.
            return CreatedAtAction(nameof(GetVendorById), new { id = vendor.Id }, vendor);
        }
        
        // For an admin to approve a vendor.
        // PUT /api/admin/vendors/{id}/approve
        [HttpPut("vendors/{id}/approve")]
        public async Task<IActionResult> ApproveVendor(int id)
        {
            var success = await _adminService.ApproveVendorAsync(id);
            if (!success) return BadRequest("Vendor approval failed.");
            return Ok(new { message = "Vendor approved successfully." });
        }

        // For an admin to reject a vendor.
        // PUT /api/admin/vendors/{id}/reject
        [HttpPut("vendors/{id}/reject")]
        public async Task<IActionResult> RejectVendor(int id, [FromBody] RejectVendorRequest request)
        {
            var success = await _adminService.RejectVendorAsync(id, request.Reason);
            if (!success) return BadRequest("Vendor rejection failed.");
            return Ok(new { message = "Vendor rejected." });
        }
        
        // To get a list of all vendors.
        // GET /api/admin/vendors
        [HttpGet("vendors")]
        public async Task<IActionResult> GetAllVendors()
        {
            // The result from the service is wrapped in a 200 OK response.
            return Ok(await _adminService.GetAllVendorsAsync());
        }

        // To get a single vendor by their ID.
        // GET /api/admin/vendors/{id}
        [HttpGet("vendors/{id}")]
        public async Task<IActionResult> GetVendorById(int id)
        {
            var vendor = await _adminService.GetVendorByIdAsync(id);
            // If the vendor is not found, return a 404 Not Found response.
            if (vendor == null) return NotFound();
            return Ok(vendor);
        }

        // Endpoint to delete a vendor.
        // DELETE /api/admin/vendors/{id}
        [HttpDelete("vendors/{id}")]
        public async Task<IActionResult> DeleteVendor(int id)
        {
            var success = await _adminService.DeleteVendorAsync(id);
            if (!success) return NotFound();
            // Return a 204 No Content response, which is standard for a successful deletion with no body.
            return NoContent();
        }
    }
}