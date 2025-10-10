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
        public AdminController(AdminService adminService) => _adminService = adminService;

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
    }
}

