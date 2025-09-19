// backend/Controllers/LeadershipController.cs
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] is the security attribute. This one locks down the ENTIRE controller.
    // Only users who are authenticated AND have the "Leadership" role claim in their JWT can access these endpoints.
    [Authorize(Roles = "Leadership")]
    public class LeadershipController : ControllerBase
    {
        private readonly LeadershipService _leadershipService;
        public LeadershipController(LeadershipService leadershipService)
        {
            _leadershipService = leadershipService;
        }
        // GET /api/leadership/search?type=...&query=...
        [HttpGet("search")]
        // [FromQuery] tells ASP.NET to get these parameters from the URL's query string.
        public async Task<IActionResult> Search([FromQuery] string type, [FromQuery] string query)
        {
            // Delegate the actual work to the service.
            var result = await _leadershipService.SearchAsync(type, query);
            if (result == null)
            {
                return BadRequest("Invalid search type or query.");
            }
            return Ok(result);
        }

        // GET /api/leadership/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var vendors = await _leadershipService.GetDashboardAsync();
            return Ok(vendors);
        }

        // GET /api/leadership/vendors/{id}
        // The '{id}' in the route maps to the 'int id' parameter in the method.
        [HttpGet("vendors/{id}")]
        public async Task<IActionResult> GetVendorById(int id)
        {
            var vendor = await _leadershipService.GetVendorByIdAsync(id);
            // If the vendor is not found, return a 404 Not Found response.
            if (vendor == null)
            {
                return NotFound();
            }
            return Ok(vendor);
        }

        // GET /api/leadership/vendors/{vendorId}/employees/{employeeId}
        [HttpGet("vendors/{vendorId}/employees/{employeeId}")]
        public async Task<IActionResult> GetEmployeeById(int vendorId, int employeeId)
        {
            var employeeDetails = await _leadershipService.GetEmployeeByIdAsync(vendorId, employeeId);
            if (employeeDetails == null)
            {
                return NotFound();
            }
            return Ok(employeeDetails);
        }
    }
}