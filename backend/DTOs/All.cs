using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    // --- Generic DTOs ---
    public record UserDto(int Id, string Email, string? FirstName, string? LastName);
    public record RoleDto(int Id, string Name);

    // --- Auth DTOs ---
    public record LoginRequest(string Email, string Password);
    public record VendorSubmissionRequest(string FirstName, string LastName, string Password);

    // --- Admin DTOs ---
    public record CreateVendorRequest(string CompanyName, string ContactEmail);
    public record RejectVendorRequest(string? Reason);
    public record VendorDto(
        int Id,
        string CompanyName,
        string ContactEmail,
        string Status,
        DateTime CreatedAt,
        int AddedByAdminId
    );

    // --- Vendor DTOs ---
    public class CreateEmployeeDto
    {
        [Required] public string FirstName { get; set; } = string.Empty;
        [Required] public string LastName { get; set; } = string.Empty;
        public string? JobTitle { get; set; }
        public IFormFile? ResumeFile { get; set; }
    }
    public record UpdateEmployeeDto(string FirstName, string LastName, string? JobTitle);
    public record EmployeeDto(int Id, string FirstName, string LastName, string? JobTitle);

    // --- Leadership DTOs ---
    public record VendorDetailDto(
        int Id,
        string CompanyName,
        string ContactEmail,
        string Status,
        List<EmployeeDto> Employees
    );
    public record EmployeeDetailDto(
        int Id,
        string FirstName,
        string LastName,
        string? JobTitle,
        int VendorId,
        string? ResumeDownloadUrl
    );
    public record SearchResultDto(string Type, List<object> Results);
}