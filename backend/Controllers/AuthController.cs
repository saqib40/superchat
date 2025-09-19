// four main routes
// 1- /login
// 2- /forgot-password (make it later since i haven't structured anything in the db, maybe add a column in Users table "OTP?")
// 3- /submit-vendor-details/{token}
// 4- /approval-by-admin

using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    // Records for our request bodies.
    public record LoginRequest(string Email, string Password);
    public record VendorSubmissionRequest(string FirstName, string LastName, string Password);

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        public AuthController(AuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.LoginAsync(request.Email, request.Password);
            if (token == null)
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }
            return Ok(new { token });
        }
        [HttpPost("submit-vendor-details/{token}")]
        public async Task<IActionResult> SubmitVendorDetails(Guid token, [FromBody] VendorSubmissionRequest request)
        {
            var success = await _authService.SubmitVendorDetailsAsync(
                token,
                request.FirstName,
                request.LastName,
                request.Password
            );

            if (!success)
            {
                return BadRequest(new { message = "Invalid or expired token." });
            }

            return Ok(new { message = "Your details have been submitted for admin approval." });
        }
    }
}