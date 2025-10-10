using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }
        public Guid PublicId { get; set; } = Guid.NewGuid();
        
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        // --- NEW PROPERTY ADDED HERE ---
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Open"; // Default status for all new jobs

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiryDate { get; set; }
        public bool IsActive { get; set; } = true;

        // Foreign Key to the User who created the job (a Leader)
        public int CreatedByLeaderId { get; set; }

        // Navigation Properties
        [ForeignKey("CreatedByLeaderId")]
        public virtual User CreatedByLeader { get; set; } = null!;
        public virtual ICollection<JobVendor> VendorAssignments { get; set; } = new List<JobVendor>();
        public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}