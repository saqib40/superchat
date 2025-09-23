using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Config
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        // Define a DbSet for each table you want to interact with
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "Leadership" },
                new Role { Id = 3, Name = "Vendor" }
            );

            // --- Configure the new JobVendor many-to-many relationship ---
            modelBuilder.Entity<JobVendor>()
                // specific job can only be assigned to a specific vendor once
                // must be unique for every row, preventing duplicate assignments
                .HasKey(jv => new { jv.JobId, jv.VendorId }); // Composite primary key
            // JobVendor -> Job
            modelBuilder.Entity<JobVendor>()
                .HasOne(jv => jv.Job)
                .WithMany(j => j.VendorAssignments)
                .HasForeignKey(jv => jv.JobId);
            // JobVendor -> Vendor
            modelBuilder.Entity<JobVendor>()
                .HasOne(jv => jv.Vendor)
                .WithMany(v => v.JobAssignments)
                .HasForeignKey(jv => jv.VendorId);


            // --- Configure the new one-to-many relationship between Job and Employee ---
            modelBuilder.Entity<Job>()
                .HasMany(j => j.Employees)
                .WithOne(e => e.Job)
                .HasForeignKey(e => e.JobId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent deleting a job if it has employees


            // Configure the many-to-many relationship between User and Role
            // This automatically creates the 'UserRoles' join table
            modelBuilder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany(r => r.Users)
                .UsingEntity(j => j.ToTable("UserRoles"));

            // Configure the one-to-many relationship between Vendor and Employee
            modelBuilder.Entity<Vendor>()
                .HasMany(v => v.Employees)
                .WithOne(e => e.Vendor)
                .HasForeignKey(e => e.VendorId)
                .OnDelete(DeleteBehavior.Cascade); // Optional: delete employees if vendor is deleted
                
            // to break cascade cycle
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.CreatedByUser)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure the one-to-one relationship between a Vendor and their User account
            modelBuilder.Entity<Vendor>()
                .HasOne(v => v.User)
                .WithOne()
                .HasForeignKey<Vendor>(v => v.UserId);
        }
    }
}