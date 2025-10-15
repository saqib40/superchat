using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Vendor")]
    public class VendorController : ControllerBase
    {
        private readonly VendorService _vendorService;
        public VendorController(VendorService vendorService) => _vendorService = vendorService;

        private Guid GetCurrentUserPublicId() => Guid.Parse(User.FindFirstValue("PublicId"));

        [HttpPost("employees")]
        public async Task<IActionResult> CreateEmployee([FromForm] CreateEmployeeRequest dto)
        {
            var employee = await _vendorService.CreateEmployeeAsync(dto, GetCurrentUserPublicId());
            if (employee == null) return BadRequest("Could not create employee. Ensure you are assigned to this job.");
            return Ok(employee);
        }

        [HttpDelete("employees/{publicId:guid}")]
        public async Task<IActionResult> SoftDeleteEmployee(Guid publicId)
        {
            var success = await _vendorService.SoftDeleteEmployeeAsync(publicId, GetCurrentUserPublicId());
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpGet("jobs")]
        public async Task<IActionResult> GetMyAssignedJobs()
        {
            var jobs = await _vendorService.GetMyAssignedJobsAsync(GetCurrentUserPublicId());
            return Ok(jobs);
        }

        // --- REPLACED ENDPOINT ---
        // This new endpoint provides a much richer view, including candidate statuses.
        /// <summary>
        /// Gets a detailed view of a single assigned job, including the status of all submitted candidates.
        /// </summary>
        [HttpGet("jobs/{jobPublicId:guid}")]
        public async Task<IActionResult> GetMyAssignedJobDetails(Guid jobPublicId)
        {
            var jobDetails = await _vendorService.GetMyAssignedJobDetailsAsync(jobPublicId, GetCurrentUserPublicId());
            if (jobDetails == null) return NotFound();
            return Ok(jobDetails);
        }

    }
}
