using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public record CreateLeaderRequest(
        [Required] string Email,
        [Required] string Password,
        [Required] string FirstName,
        [Required] string LastName
    );
    public record UserDto(Guid PublicId, string Email, string FirstName, string LastName);
    public record AdminDashboardStatsDto(
    int ActiveJobCount,
    int ActiveVendorCount,
    int TotalApplications,
    int HiredApplications,
    List<UserDto> RecentlyAddedLeaders,
    List<VendorDto> RecentlyAddedVendors
);
}