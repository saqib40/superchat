using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public record LoginRequest(string Email, string Password);
    public record VendorSetPasswordRequest([Required] string Password);

}