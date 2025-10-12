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
        private readonly RecaptchaService _recaptcha;
        public AuthController(AuthService authService, RecaptchaService recaptcha)
        {
            _authService = authService;
            _recaptcha = recaptcha;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            Console.WriteLine($"Email: {request.Email}");
            Console.WriteLine($"Password: {request.Password}");
            Console.WriteLine($"reCAPTCHA token: {request.RecaptchaToken}");
            var captchaPassed = await _recaptcha.VerifyTokenAsync(request.RecaptchaToken, "login");
            Console.WriteLine($"reCAPTCHA verification result: {captchaPassed}");

            if (!captchaPassed)
            {
                return BadRequest(new { message = "reCAPTCHA verification failed." });
            }
            var token = await _authService.LoginAsync(request.Email, request.Password, request.RecaptchaToken);
            if (token == null) return Unauthorized(new { message = "Invalid credentials." });
            return Ok(new { token });
        }

        // The endpoint where the vendor sets their password after clicking the email link.
        [AllowAnonymous]
        [HttpPost("setup-vendor/{token:guid}")]
        public async Task<IActionResult> SetupVendor(Guid token, [FromBody] VendorSetPasswordRequest request)
        {
            // 1. Validate password strength
            if (!PasswordValidator.IsStrongPassword(request.Password))
            {
                return BadRequest("Password does not meet strength requirements.");
            }
            // 2. Proceed with vendor setup
            var success = await _authService.SetupVendorAccountAsync(token, request.Password);

            if (!success)
            {
                return BadRequest("This setup link is invalid or has expired.");
            }

            return Ok(new { message = "Your account has been successfully set up. You can now log in." });
        }
    }
}

