SET QUOTED_IDENTIFIER ON;
GO
USE superchat;
GO

-- 1. DECLARE VARIABLES for User IDs, Vendor IDs, and Role IDs
DECLARE @AdminUserId INT, @LeaderUserId INT, @VendorUserId INT;
DECLARE @SampleVendorId INT;
DECLARE @RoleAdminId INT = 1;
DECLARE @RoleLeaderId INT = 2;
DECLARE @RoleVendorId INT = 3;


-- 2. CREATE SAMPLE USERS AND CAPTURE THEIR NEW IDs

-- ADMIN USER 1 (Password: hlo123)
-- This user is the root, so it has no 'AddedById'
INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId)
VALUES ('admin@example.com', '6BUs2KZD3CddlP5NMEdTog==;R9FPf6LiAFph/Mf0nm6O7oFc4+8zuFMNVZaTO6Ou83k=', 'Admin', 'User', 1, GETUTCDATE(), NEWID());
SET @AdminUserId = SCOPE_IDENTITY();

-- leader
--rohit@gmail.com
--123ok
-- LEADER USER (Password: hii12345)
-- ADDED: The 'AddedById' column to track that the Admin created this user
INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId, AddedById)
VALUES ('leader@example.com', 'rRgO6Fn88OwNTmZ3RdvF6Q==;YSnvL5y3gUymscMrfkw2A8QFq172PGPuVpNi189472c=', 'Lead', 'User', 1, GETUTCDATE(), NEWID(), @AdminUserId);
SET @LeaderUserId = SCOPE_IDENTITY();

-- VENDOR USER (Password: 12345)
-- ADDED: The 'AddedById' column to track that the Admin created this user (could also be the leader)
INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId, AddedById)
VALUES ('vendor@example.com', 'aDFzZFm2bkV2aWW3APVpzw==;OV6teR+9jhsN2gJZsZW3/W8wf2Z3EHwZKGDGDxTrOXs=', 'Vendor', 'User', 1, GETUTCDATE(), NEWID(), @AdminUserId);
SET @VendorUserId = SCOPE_IDENTITY();


-- 3. LINK USERS TO ROLES (The Role IDs 1, 2, 3 are already in the DB from the migration)
INSERT INTO UserRoles (UsersId, RolesId) VALUES (@AdminUserId, @RoleAdminId);      -- Admin User
INSERT INTO UserRoles (UsersId, RolesId) VALUES (@LeaderUserId, @RoleLeaderId);    -- Leader User
INSERT INTO UserRoles (UsersId, RolesId) VALUES (@VendorUserId, @RoleVendorId);    -- Vendor User


-- 4. CREATE A SAMPLE VENDOR RECORD
-- This links the Vendor's User account (@VendorUserId) and sets the Leader who added them (@LeaderUserId).
-- CHANGED: 'AddedByLeaderId' to 'AddedById' to match the EF Core model.
-- ADDED: 'IsActive' for completeness.
INSERT INTO Vendors (CompanyName, ContactEmail, Country, Status, IsActive, UserId, AddedById, CreatedAt, PublicId)
VALUES ('Sample Vendor Co', 'vendor@example.com', 'USA', 'Active', 1, @VendorUserId, @LeaderUserId, GETUTCDATE(), NEWID());
SET @SampleVendorId = SCOPE_IDENTITY();


-- 5. VERIFY THE FINAL RESULT
SELECT u.Id, u.Email, u.AddedById, r.Name AS RoleName
FROM Users u
LEFT JOIN UserRoles ur ON u.Id = ur.UsersId
LEFT JOIN Roles r ON ur.RolesId = r.Id;

SELECT CompanyName, ContactEmail, Country, UserId, AddedById FROM Vendors;
GO