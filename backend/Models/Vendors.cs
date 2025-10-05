using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Vendor
    {
        [Key]
        public int Id { get; set; }
        public Guid PublicId { get; set; } = Guid.NewGuid();
        
        // --- ADDED for Soft Deletes ---
        public bool IsActive { get; set; } = true;

        [Required]
        [MaxLength(255)]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [MaxLength(256)]
        public string ContactEmail { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = string.Empty;

        public Guid? VerificationToken { get; set; }
        public DateTime? TokenExpiry { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public int? UserId { get; set; }
        public int AddedById { get; set; } // RENAMED from AddedByLeaderId
        public int? UpdatedById { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [ForeignKey("AddedById")]
        public virtual User AddedBy { get; set; } = null!;

        public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
        public virtual ICollection<JobVendor> JobAssignments { get; set; } = new List<JobVendor>();
    }
}
