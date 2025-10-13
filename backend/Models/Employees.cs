using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
// using backend.Enums;

namespace backend.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        public Guid PublicId { get; set; } = Guid.NewGuid();

        public bool IsActive { get; set; } = true;

        [Required]
        [MaxLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public int? YearsOfExperience { get; set; }

        public string? Skills { get; set; } // Can be a comma-separated list or JSON string

        [MaxLength(100)]
        public string? JobTitle { get; set; }

        [MaxLength(1024)]
        public string ResumeS3Key { get; set; } = string.Empty;

        // --- NEW PROPERTY ADDED HERE ---
        // [Required]
        // [MaxLength(50)]
        // public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted; // Default status for all new employees

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public int VendorId { get; set; }
        public int JobId { get; set; }
        public int CreatedByUserId { get; set; }
        public int? UpdatedByUserId { get; set; }

        // Navigation Properties
        [ForeignKey("VendorId")]
        public virtual Vendor Vendor { get; set; } = null!;

        [ForeignKey("CreatedByUserId")]
        public virtual User CreatedByUser { get; set; } = null!;

        [ForeignKey("JobId")] // ADDED
        public virtual Job Job { get; set; } = null!;
    }
}