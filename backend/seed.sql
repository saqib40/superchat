-- Idempotent Version

SET QUOTED_IDENTIFIER ON;
GO
-- The USE statement might not be needed if the -d flag is used, but it's safe to keep.
USE superchat;
GO

-- 1. DECLARE VARIABLES (No changes here)
DECLARE @AdminUserId INT, @LeaderUserId INT, @VendorUserId INT;
DECLARE @SampleVendorId INT;
DECLARE @RoleAdminId INT = 1, @RoleLeaderId INT = 2, @RoleVendorId INT = 3;


-- 2. CREATE SAMPLE USERS (with existence checks)

-- ADMIN USER 1
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@example.com')
BEGIN
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId)
    VALUES ('admin@example.com', '6BUs2KZD3CddlP5NMEdTog==;R9FPf6LiAFph/Mf0nm6O7oFc4+8zuFMNVZaTO6Ou83k=', 'Admin', 'User', 1, GETUTCDATE(), NEWID());
END
-- Always get the ID, whether it was just inserted or already existed
SET @AdminUserId = (SELECT Id FROM Users WHERE Email = 'admin@example.com');


-- LEADER USER
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'leader@example.com')
BEGIN
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId, AddedById)
    VALUES ('leader@example.com', 'rRgO6Fn88OwNTmZ3RdvF6Q==;YSnvL5y3gUymscMrfkw2A8QFq172PGPuVpNi189472c=', 'Lead', 'User', 1, GETUTCDATE(), NEWID(), @AdminUserId);
END
SET @LeaderUserId = (SELECT Id FROM Users WHERE Email = 'leader@example.com');


-- VENDOR USER
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'vendor@example.com')
BEGIN
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId, AddedById)
    VALUES ('vendor@example.com', 'aDFzZFm2bkV2aWW3APVpzw==;OV6teR+9jhsN2gJZsZW3/W8wf2Z3EHwZKGDGDxTrOXs=', 'Vendor', 'User', 1, GETUTCDATE(), NEWID(), @AdminUserId);
END
SET @VendorUserId = (SELECT Id FROM Users WHERE Email = 'vendor@example.com');


-- 3. LINK USERS TO ROLES (with existence checks)
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UsersId = @AdminUserId AND RolesId = @RoleAdminId)
BEGIN
    INSERT INTO UserRoles (UsersId, RolesId) VALUES (@AdminUserId, @RoleAdminId);
END

IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UsersId = @LeaderUserId AND RolesId = @RoleLeaderId)
BEGIN
    INSERT INTO UserRoles (UsersId, RolesId) VALUES (@LeaderUserId, @RoleLeaderId);
END

IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UsersId = @VendorUserId AND RolesId = @RoleVendorId)
BEGIN
    INSERT INTO UserRoles (UsersId, RolesId) VALUES (@VendorUserId, @RoleVendorId);
END


-- 4. CREATE A SAMPLE VENDOR RECORD (with existence check)
IF NOT EXISTS (SELECT 1 FROM Vendors WHERE CompanyName = 'Sample Vendor Co')
BEGIN
    INSERT INTO Vendors (CompanyName, ContactEmail, Country, Status, IsActive, UserId, AddedById, CreatedAt, PublicId)
    VALUES ('Sample Vendor Co', 'vendor@example.com', 'USA', 'Active', 1, @VendorUserId, @LeaderUserId, GETUTCDATE(), NEWID());
END
SET @SampleVendorId = (SELECT Id FROM Vendors WHERE CompanyName = 'Sample Vendor Co');

GO