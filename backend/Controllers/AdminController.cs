using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.Helpers;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;
        // Inject LeadershipService for re-use, can help us give admin more rights in future of leader
        private readonly LeadershipService _leadershipService;
        public AdminController(AdminService adminService, LeadershipService leadershipService)
        {
            _adminService = adminService;
            _leadershipService = leadershipService;
        }
        private int GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        [HttpPost("leaders")]
        public async Task<IActionResult> CreateLeader([FromBody] CreateLeaderRequest dto)
        {
            //Added the Password Validator check condition
            if (!PasswordValidator.IsStrongPassword(dto.Password))
            {
                return BadRequest("Password does not meet strength requirements.");
            }
            var leader = await _adminService.CreateLeaderAsync(dto, GetCurrentUserId());
            if (leader == null) return BadRequest("Could not create leader.");
            return Ok(leader);
        }

        [HttpDelete("leaders/{publicId:guid}")]
        public async Task<IActionResult> SoftDeleteLeader(Guid publicId)
        {
            var success = await _adminService.SoftDeleteLeaderAsync(publicId);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpGet("leaders")]
        public async Task<IActionResult> GetAllLeaders()
        {
            var leaders = await _adminService.GetAllLeadersAsync();
            return Ok(leaders);
        }

        // Provides a snapshot of key metrics for the entire platform.
        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        // Gets a list of all jobs across the entire system.
        [HttpGet("jobs")]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _adminService.GetAllJobsAsync();
            return Ok(jobs);
        }

        // Gets a list of all vendors across the entire system.
        [HttpGet("vendors")]
        public async Task<IActionResult> GetAllVendors()
        {
            var vendors = await _adminService.GetAllVendorsAsync();
            return Ok(vendors);
        }

        // (Admin Override) Allows an admin to soft-delete any vendor in the system.
        [HttpDelete("vendors/{publicId:guid}")]
        public async Task<IActionResult> AdminSoftDeleteVendor(Guid publicId)
        {
            // We can re-use the logic from LeadershipService for the deletion itself.
            var success = await _leadershipService.SoftDeleteVendorAsync(publicId);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}

