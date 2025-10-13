using backend.Config;
using backend.Helpers;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly RecaptchaService _recaptcha;

        public AuthService(ApplicationDbContext context, IConfiguration configuration, RecaptchaService recaptcha)
        {
            _context = context;
            _configuration = configuration;
            _recaptcha = recaptcha;
        }

        public async Task<string?> LoginAsync(string email, string password, string recaptchaToken)
        {
            // reCAPTCHA already verified in controller — no need to check again
          
            var user = await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Email == email);
            Console.WriteLine($"Attempting login for: {email}");
            Console.WriteLine($"User found: {user != null}");
            Console.WriteLine($"Password valid: {PasswordHelper.Verify(password, user?.PasswordHash)}");
            if (user == null || !PasswordHelper.Verify(password, user.PasswordHash))
            {
                Console.WriteLine("User not found or password mismatch.");
                return null;
            }

            Console.WriteLine("Login successful. Generating token...");
            return GenerateJwtToken(user);
        }

        // This method is called when the vendor submits their password after clicking the email link.
        public async Task<bool> SetupVendorAccountAsync(Guid token, string password)
        {
           
            var vendor = await _context.Vendors.Include(v => v.User)
                .FirstOrDefaultAsync(v => v.VerificationToken == token && v.TokenExpiry > DateTime.UtcNow);

            if (vendor == null || vendor.User == null) return false;

            // Update the vendor's user account with the password they submitted.
            var user = vendor.User;
            user.PasswordHash = PasswordHelper.Hash(password);

            // Finalize the vendor status and invalidate the token.
            vendor.Status = "Verified";
            vendor.VerificationToken = null;
            vendor.TokenExpiry = null;
            await _context.SaveChangesAsync();

            return true;
        }

        private string GenerateJwtToken(User user)
        {
            var secretKey = _configuration["JWT_SECRET"];
            var issuer = _configuration["JWT_ISSUER"];
            var audience = _configuration["JWT_AUDIENCE"];
            if (string.IsNullOrEmpty(secretKey)) throw new Exception("JWT_SECRET is not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("PublicId", user.PublicId.ToString()), // Crucial for identifying the user in requests
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
            };

            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.Name));
            }

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

