using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Helpers;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        public AuthController(AuthService authService) => _authService = authService;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.LoginAsync(request.Email, request.Password);
            if (token == null) return Unauthorized(new { message = "Invalid credentials." });
            return Ok(new { token });
        }

        // The endpoint where the vendor sets their password after clicking the email link.
        [AllowAnonymous]
        [HttpPost("setup-vendor/{token:guid}")]
        public async Task<IActionResult> SetupVendor(Guid token, [FromBody] VendorSetPasswordRequest request)
        {
            if (!PasswordValidator.IsStrongPassword(request.Password))
            {
                return BadRequest("Password does not meet strength requirements.");
            }
            var success = await _authService.SetupVendorAccountAsync(token, request.Password);
            if (!success)
            {
                return BadRequest("This setup link is invalid or has expired.");
            }
            return Ok(new { message = "Your account has been successfully set up. You can now log in." });
        }
    }
}

