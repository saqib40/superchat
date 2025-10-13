using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.Helpers;
using backend.Enums;

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
            if (!CountryValidator.IsValidCountry(dto.Country))
            {
                return BadRequest("Invalid country. Please select a valid country.");
            }
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
            if (!CountryValidator.IsValidCountry(dto.Country))
            {
                return BadRequest("Invalid country. Please select a valid country.");
            }
            var job = await _leadershipService.CreateJobAsync(dto, GetCurrentUserId());
            if (job == null) return BadRequest("Could not create job. Ensure vendors exist and are in the specified country.");
            return Ok(job);
        }

        [HttpGet("vendors")]
        public async Task<IActionResult> GetVendorsByCountry([FromQuery] string country)
        {
            if (!CountryValidator.IsValidCountry(country))
            {
                return BadRequest("Invalid country. Please select a valid country.");
            }
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
        
        [HttpDelete("jobs/{publicId:guid}")]
        public async Task<IActionResult> SoftDeleteJob(Guid publicId)
        {
            var success = await _leadershipService.SoftDeleteJobAsync(publicId);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpGet("jobs/{jobPublicId:guid}/applications")]
        public async Task<IActionResult> GetApplicationsForJob(Guid jobPublicId, [FromQuery] ApplicationStatus? status)
        {
            var applications = await _leadershipService.GetApplicationsForJobAsync(jobPublicId, GetCurrentUserId(), status);
            return Ok(applications);
        }

        [HttpGet("applications/hired")]
        public async Task<IActionResult> GetHiredApplications()
        {
            var applications = await _leadershipService.GetHiredApplicationsForLeaderAsync(GetCurrentUserId());
            return Ok(applications);
        }

        [HttpPatch("applications/{applicationPublicId:guid}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(Guid applicationPublicId, [FromBody] UpdateApplicationStatusRequest dto)
        {
            var success = await _leadershipService.UpdateApplicationStatusAsync(applicationPublicId, dto.NewStatus, GetCurrentUserId());
            if (!success) return BadRequest("Could not update status.");
            return Ok(new { message = "Status updated successfully." });
        }

        [HttpPatch("jobs/{jobPublicId:guid}/status")]
        public async Task<IActionResult> UpdateJobStatus(Guid jobPublicId, [FromBody] UpdateJobStatusRequest dto)
        {
            var success = await _leadershipService.UpdateJobStatusAsync(jobPublicId, dto.NewStatus, GetCurrentUserId());
            if (!success) return BadRequest("Could not update job status.");
            return Ok(new { message = "Job status updated successfully." });
        }

        [HttpPost("applications/{applicationPublicId:guid}/notes")]
        public async Task<IActionResult> AddApplicationNotes(Guid applicationPublicId, [FromBody] AddApplicationNoteRequest dto)
        {
            var success = await _leadershipService.AddFeedbackToApplicationAsync(applicationPublicId, dto.Feedback, GetCurrentUserId());
            if (!success) return BadRequest("Could not add notes.");
            return Ok(new { message = "Notes added successfully." });
        }
    }
}