using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Config
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobVendor> JobVendors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- GLOBAL QUERY FILTERS FOR SOFT DELETES ---
            // This powerful feature automatically adds a .Where(x => x.IsActive) clause to every
            // LINQ query for these entities, ensuring you never accidentally show deleted data.
            modelBuilder.Entity<User>().HasQueryFilter(u => u.IsActive);
            modelBuilder.Entity<Vendor>().HasQueryFilter(v => v.IsActive);
            modelBuilder.Entity<Employee>().HasQueryFilter(e => e.IsActive);
            modelBuilder.Entity<Job>().HasQueryFilter(j => j.IsActive);
            modelBuilder.Entity<JobVendor>().HasQueryFilter(jv => jv.Job.IsActive && jv.Vendor.IsActive);

            // --- SEEDING ---
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "Leadership" },
                new Role { Id = 3, Name = "Vendor" }
            );

            // --- RELATIONSHIP CONFIGURATION ---

            // User self-referencing relationship (for creator tracking)
            modelBuilder.Entity<User>()
                .HasOne(u => u.AddedBy)
                .WithMany()
                .HasForeignKey(u => u.AddedById)
                .OnDelete(DeleteBehavior.Restrict); // Prevent deleting a user if they have created others.

            // User <-> Role (many-to-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany(r => r.Users)
                .UsingEntity(j => j.ToTable("UserRoles"));
            
            // Vendor -> User (one-to-one for vendor's own account)
            modelBuilder.Entity<Vendor>()
                .HasOne(v => v.User)
                .WithOne()
                .HasForeignKey<Vendor>(v => v.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Vendor -> User (one-to-many for creator tracking)
            modelBuilder.Entity<Vendor>()
                .HasOne(v => v.AddedBy)
                .WithMany()
                .HasForeignKey(v => v.AddedById)
                .OnDelete(DeleteBehavior.Restrict);

            // Job <-> Vendor (many-to-many via JobVendor)
            modelBuilder.Entity<JobVendor>().HasKey(jv => new { jv.JobId, jv.VendorId });
            modelBuilder.Entity<JobVendor>().HasOne(jv => jv.Job).WithMany(j => j.VendorAssignments).HasForeignKey(jv => jv.JobId);
            modelBuilder.Entity<JobVendor>().HasOne(jv => jv.Vendor).WithMany(v => v.JobAssignments).HasForeignKey(jv => jv.VendorId);

            // Job -> Employee (one-to-many)
            modelBuilder.Entity<Job>()
                .HasMany(j => j.Employees)
                .WithOne(e => e.Job)
                .HasForeignKey(e => e.JobId)
                .OnDelete(DeleteBehavior.Restrict);

            // Vendor -> Employee (one-to-many)
            modelBuilder.Entity<Vendor>()
                .HasMany(v => v.Employees)
                .WithOne(e => e.Vendor)
                .HasForeignKey(e => e.VendorId)
                .OnDelete(DeleteBehavior.Cascade); // Keep this if deleting a vendor should delete their employees.

            // Employee -> User (one-to-many for creator tracking - to break cascade cycle)
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.CreatedByUser)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // --- UNIQUE INDEXES ---
            modelBuilder.Entity<User>().HasIndex(u => u.PublicId).IsUnique();
            modelBuilder.Entity<Vendor>().HasIndex(v => v.PublicId).IsUnique();
            modelBuilder.Entity<Job>().HasIndex(j => j.PublicId).IsUnique();
            modelBuilder.Entity<Employee>().HasIndex(e => e.PublicId).IsUnique();
        }
    }
}
