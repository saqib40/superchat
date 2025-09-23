namespace backend.Models
{
    // This class represents the many-to-many relationship between Job and Vendor
    public class JobVendor
    {
        public int JobId { get; set; }
        public virtual Job Job { get; set; } = null!;

        public int VendorId { get; set; }
        public virtual Vendor Vendor { get; set; } = null!;
    }
}