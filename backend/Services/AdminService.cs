using backend.Config;
using backend.DTOs;
using backend.Helpers;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Enums;

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
            var emailExistsInUsers = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            var emailExistsInEmployees = await _context.Employees.IgnoreQueryFilters().AnyAsync(e => e.Email == dto.Email);
            if (emailExistsInUsers || emailExistsInEmployees)
            {
                return null;
            }
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
            // Use .Include() to fetch the leader AND all of their created jobs in one query.
            var leader = await _context.Users
                .Include(u => u.JobsCreated)
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.PublicId == publicId);
            if (leader == null) return false;

            leader.IsActive = false;
            // --- DOMINO EFFECT ---
            // Loop through all jobs created by this leader and deactivate them.
            foreach (var job in leader.JobsCreated)
            {
                job.IsActive = false;
            }
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

        public async Task<AdminDashboardStatsDto> GetDashboardStatsAsync()
        {
            var activeJobCount = await _context.Jobs.CountAsync(); // Global query filter handles 'IsActive'
            var activeVendorCount = await _context.Vendors.CountAsync();
            var totalApplications = await _context.JobApplications.CountAsync();
            var hiredApplications = await _context.JobApplications.CountAsync(app => app.Status == ApplicationStatus.Hired);

            var recentlyAddedLeaders = await _context.Users
                .Where(u => u.Roles.Any(r => r.Name == "Leadership"))
                .OrderByDescending(u => u.CreatedAt)
                .Take(5)
                .Select(u => new UserDto(u.PublicId, u.Email, u.FirstName, u.LastName))
                .ToListAsync();

            var recentlyAddedVendors = await _context.Vendors
                .OrderByDescending(v => v.CreatedAt)
                .Take(5)
                .Select(v => new VendorDto(v.PublicId, v.CompanyName, v.ContactEmail, v.Country, v.Status))
                .ToListAsync();

            return new AdminDashboardStatsDto(
                activeJobCount,
                activeVendorCount,
                totalApplications,
                hiredApplications,
                recentlyAddedLeaders,
                recentlyAddedVendors
            );
        }

        // Gets a list of ALL active jobs in the system, regardless of creator.
        public async Task<IEnumerable<JobDto>> GetAllJobsAsync()
        {
            return await _context.Jobs
                .OrderByDescending(j => j.CreatedAt)
                .Select(j => new JobDto(j.PublicId, j.Title, j.Country, j.CreatedAt, j.ExpiryDate, (j.ExpiryDate - DateTime.UtcNow).TotalDays))
                .ToListAsync();
        }

        // Gets a list of ALL active vendors in the system.
        public async Task<IEnumerable<VendorDto>> GetAllVendorsAsync()
        {
            return await _context.Vendors
                .OrderByDescending(v => v.CreatedAt)
                .Select(v => new VendorDto(v.PublicId, v.CompanyName, v.ContactEmail, v.Country, v.Status))
                .ToListAsync();
        }
    }
}

