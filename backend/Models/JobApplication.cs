// This is the crucial new model that correctly links an Employee to a Job with a specific Status. 
// This prevents us from incorrectly putting the status on the Employee model itself.

using backend.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class JobApplication
    {
        [Key]
        public int Id { get; set; }
        public Guid PublicId { get; set; } = Guid.NewGuid();
        public int JobId { get; set; }
        public int EmployeeId { get; set; }

        // The status of this specific application
        public ApplicationStatus Status { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;

        public string? Feedback { get; set; } // For interview notes, etc.

        // Navigation properties for EF Core to understand the relationships
        [ForeignKey("JobId")]
        public virtual Job Job { get; set; } = null!;

        [ForeignKey("EmployeeId")]
        public virtual Employee Employee { get; set; } = null!;
    }
}