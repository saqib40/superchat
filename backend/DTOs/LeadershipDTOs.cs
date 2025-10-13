using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.DTOs
{
    public record JobDto(
        Guid PublicId,
        string Title,
        string Country,
        DateTime CreatedAt,
        DateTime ExpiryDate,
        double DaysRemaining
    );
    public record EmployeeWithVendorDto(
        Guid PublicId,
        string FirstName,
        string LastName,
        string? JobTitle,
        string VendorCompanyName
    );
    public record JobDetailDto(
        Guid PublicId,
        string Title,
        string Description,
        string Country,
        DateTime ExpiryDate,
        UserDto CreatedBy,
        List<VendorDto> AssignedVendors,
        List<EmployeeWithVendorDto> SubmittedEmployees
    );
    public record CreateVendorRequest(
        [Required] string CompanyName,
        [Required] string ContactEmail,
        [Required] string Country
    );
    public record CreateJobRequest(
        [Required] string Title,
        [Required] string Description,
        [Required] string Country,
        [Required] DateTime ExpiryDate,
        [Required] List<Guid> AssignedVendorPublicIds
    );
    // Represents an application for use in API responses.
    public record JobApplicationDto(
        Guid ApplicationPublicId,
        ApplicationStatus Status,
        DateTime LastUpdatedAt,
        Guid EmployeePublicId,
        string EmployeeFirstName,
        string EmployeeLastName,
        string EmployeeEmail,
        Guid JobPublicId,
        string JobTitle
    );
    
    public record UpdateApplicationStatusRequest(
        [Required] ApplicationStatus NewStatus // Use the enum for type safety
    );
    // Represents the request body for updating a job's status.
    public record UpdateJobStatusRequest(
        [Required] JobStatus NewStatus
    );
}