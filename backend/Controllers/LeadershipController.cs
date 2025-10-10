using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Leadership")]
    public class LeadershipController : ControllerBase
    {
        private readonly LeadershipService _leadershipService;
        public LeadershipController(LeadershipService leadershipService) => _leadershipService = leadershipService;

        private int GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        [HttpPost("vendors")]
        public async Task<IActionResult> CreateVendor([FromBody] CreateVendorRequest dto)
        {
            var vendor = await _leadershipService.CreateVendorAsync(dto, GetCurrentUserId());
            if (vendor == null) return BadRequest("Could not create vendor.");
            return Ok(vendor);
        }

        [HttpDelete("vendors/{publicId:guid}")]
        public async Task<IActionResult> SoftDeleteVendor(Guid publicId)
        {
            var success = await _leadershipService.SoftDeleteVendorAsync(publicId);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPost("jobs")]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobRequest dto)
        {
            var job = await _leadershipService.CreateJobAsync(dto, GetCurrentUserId());
            if (job == null) return BadRequest("Could not create job. Ensure vendors exist and are in the specified country.");
            return Ok(job);
        }

        [HttpGet("vendors")]
        public async Task<IActionResult> GetVendorsByCountry([FromQuery] string country)
        {
            var vendors = await _leadershipService.GetVendorsByCountryAsync(country);
            return Ok(vendors);
        }

        [HttpGet("jobs")]
        public async Task<IActionResult> GetMyCreatedJobs()
        {
            var jobs = await _leadershipService.GetMyCreatedJobsAsync(GetCurrentUserId());
            return Ok(jobs);
        }

        [HttpGet("jobs/{publicId:guid}")]
        public async Task<IActionResult> GetJobByPublicId(Guid publicId)
        {
            var job = await _leadershipService.GetJobByPublicIdAsync(publicId);
            if (job == null) return NotFound();
            return Ok(job);
        }

        [HttpGet("employees/{publicId:guid}")]
        public async Task<IActionResult> GetEmployeeDetails(Guid publicId)
        {
            var employee = await _leadershipService.GetEmployeeDetailsAsync(publicId);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

    }
}

