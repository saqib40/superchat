using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using backend.Enums;

namespace backend.DTOs
{
    public record CreateLeaderRequest(
        [Required] string Email,
        [Required] string Password,
        [Required] string FirstName,
        [Required] string LastName
    );
    public record UserDto(Guid PublicId, string Email, string FirstName, string LastName);

}