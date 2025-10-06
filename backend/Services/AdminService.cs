using backend.Config;
using backend.DTOs;
using backend.Helpers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AdminService
    {
        private readonly ApplicationDbContext _context;

        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserDto?> CreateLeaderAsync(CreateLeaderRequest dto, int adminId)
        {
            var leaderRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Leadership");
            if (leaderRole == null) return null; // Should not happen if DB is seeded

            var newUser = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = PasswordHelper.Hash(dto.Password),
                AddedById = adminId
            };
            newUser.Roles.Add(leaderRole);

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return new UserDto(newUser.PublicId, newUser.Email, newUser.FirstName, newUser.LastName);
        }

        public async Task<bool> SoftDeleteLeaderAsync(Guid publicId)
        {
            // IgnoreQueryFilters() is used to find a user even if they are already soft-deleted (IsActive = false).
            var leader = await _context.Users.IgnoreQueryFilters().FirstOrDefaultAsync(u => u.PublicId == publicId);
            if (leader == null) return false;

            leader.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<UserDto>> GetAllLeadersAsync()
        {
            // The global query filter automatically handles .Where(u => u.IsActive).
            return await _context.Users
                .Where(u => u.Roles.Any(r => r.Name == "Leadership"))
                .Select(u => new UserDto(u.PublicId, u.Email, u.FirstName, u.LastName))
                .ToListAsync();
        }
    }
}

