using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public Guid PublicId { get; set; } = Guid.NewGuid();

        // --- ADDED for Soft Deletes ---
        public bool IsActive { get; set; } = true;

        [Required]
        [MaxLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        public DateTime? LastLoginDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // --- ADDED to track creator (e.g., an Admin creating a Leader) ---
        public int? AddedById { get; set; }

        // Navigation Properties
        [ForeignKey("AddedById")]
        public virtual User? AddedBy { get; set; }
        public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
    }
}
