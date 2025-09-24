using backend.Config;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Helpers;

namespace backend.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        public AuthService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<string?> LoginAsync(string email, string password)
        {
            // Find the user by their email. We use 'Include' to also load their associated Roles,
            // which we'll need later for creating claims in the JWT.
            var user = await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Email == email);

            // Check if the user exists AND if the provided password matches the hashed password in the database.
            if (user == null || !PasswordHelper.Verify(password, user.PasswordHash))
            {
                return null; // Return null if authentication fails.
            }

            // If credentials are valid, generate and return a JWT.
            return GenerateJwtToken(user);
        }
        // Called when the vendor submits their details.
        public async Task<bool> SubmitVendorDetailsAsync(Guid token, string firstName, string lastName, string password)
        {
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.VerificationToken == token);

            if (vendor == null || vendor.TokenExpiry < DateTime.UtcNow)
            {
                return false; // Invalid or expired token
            }

            // Store the submitted details temporarily on the vendor record.
            vendor.PendingFirstName = firstName;
            vendor.PendingLastName = lastName;
            vendor.PendingPasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
        
            // Update the status to await admin approval.
            vendor.Status = "PendingApproval";
            vendor.VerificationToken = null; // Invalidate the token
            vendor.TokenExpiry = null;

            await _context.SaveChangesAsync();
            return true;
        }
        private string GenerateJwtToken(User user)
        {
            // Read JWT settings (secret, issuer, audience) directly from environment variables for security.
            var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET");
            var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
            var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");

            // The signing key is what proves the token came from our server.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Claims are pieces of information (the "payload") about the user stored inside the token.
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // Standard claim for User ID
                new Claim(JwtRegisteredClaimNames.Email, user.Email),       // Standard claim for Email
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique token ID
            };

            // Add all of the user's roles as claims. This is how our authorization will work.
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.Name));
            }

            // Create the token object with all its properties.
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            // Serialize the token object into a string, which is the final JWT.
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}