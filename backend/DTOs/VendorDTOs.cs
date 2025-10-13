using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public record VendorDto(
        Guid PublicId,
        string CompanyName,
        string ContactEmail,
        string Country,
        string Status
    );
    public class CreateEmployeeRequest
    {
        [Required] public Guid JobPublicId { get; set; }
        [Required] public string FirstName { get; set; } = string.Empty;
        [Required] public string LastName { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? Skills { get; set; }
        public string? JobTitle { get; set; }
        public IFormFile ResumeFile { get; set; } = null!;
    }
    public record EmployeeDto(
        Guid PublicId,
        string FirstName,
        string LastName,
        string? JobTitle
    );
    // For detailed employee response
    public record EmployeeDetailDto(
        Guid PublicId,
        string FirstName,
        string LastName,
        string? JobTitle,
        string Email,
        string? PhoneNumber,
        int? YearsOfExperience,
        string? Skills,
        DateTime CreatedAt,
        string VendorCompanyName,
        string? ResumeDownloadUrl
    );
}