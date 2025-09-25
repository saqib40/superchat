using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // 1. Route: /login 
        [HttpPost("login")]
        // Note: We remove the Type = typeof(AuthResponse) since it's not defined
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.LoginAsync(request.Email, request.Password);

            if (token == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var user = await _authService.GetUserByEmailAsync(request.Email);

            // FIX: Return an anonymous object to avoid the AuthResponse DTO compilation error
            return Ok(new
            {
                Token = token,
                Email = user!.Email,
                Role = user.Roles.FirstOrDefault()?.Name ?? "Unknown"
            });
        }

        // 2. Route: /vendor/{token} (Token Verification - NOW A GET REQUEST)
        // REQUIREMENT: Must be a GET request and ONLY verify the token.
        [HttpGet("vendor/{token:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> VerifyVendorTokenOnly([FromRoute] Guid token)
        {
            // 1. Verify the token against the database
            var vendor = await _authService.VerifyVendorTokenAsync(token);

            if (vendor == null)
            {
                // Return 404/NotFound if the token is invalid or expired.
                return NotFound(new { message = "Invalid or expired verification link." });
            }

            // 2. The token is valid. Return 200 OK.
            // The frontend will read this 200 OK status and redirect the user 
            // to the final registration form (Name/Password submission).
            return Ok(new
            {
                message = "Token verified. You may proceed to registration.",
                contactEmail = vendor.ContactEmail
            });
        }
    }
}