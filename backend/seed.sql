-- Idempotent Version

SET QUOTED_IDENTIFIER ON;
GO
USE superchat;
GO

-- 1. DECLARE VARIABLES
DECLARE @AdminUserId INT, @Leader1Id INT, @Leader2Id INT;
DECLARE @Vendor1UserId INT, @Vendor2UserId INT, @Vendor3UserId INT;
DECLARE @Vendor1Id INT, @Vendor2Id INT, @Vendor3Id INT;
DECLARE @SdeJobId INT, @ManagerJobId INT;
DECLARE @Emp1Id INT, @Emp2Id INT, @Emp3Id INT, @Emp4Id INT;
DECLARE @RoleAdminId INT = 1, @RoleLeaderId INT = 2, @RoleVendorId INT = 3;

-- Passwords to be hashed:
-- leader2@example.com: NewLeaderPass123! ->/Mq1VCSli7o2tzAn6oTV6Q==;DxiYQJXppFnkepjHAAB/UfLywrY4C9ONIVKvXuMCw0Q=
-- vendor2@example.com: NewVendorPass123! ->FJchHWIkna+UTT9g5DPpTQ==;yLxZaSzrLuQW89JdJXMYtvCQTX5BBkE2Z2znRMd17FU=
-- vendor3@example.com: AnotherVendor123! ->JuxGSF9QrH+Pa8GwU/+Vnw==;PdWqOygp4J8GCDEl2w33DnRcuPyvzj61Y7zYAEiIOSQ=

-- 2. CREATE SAMPLE USERS
-- ADMIN
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@example.com')
BEGIN
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId)
    VALUES ('admin@example.com', '6BUs2KZD3CddlP5NMEdTog==;R9FPf6LiAFph/Mf0nm6O7oFc4+8zuFMNVZaTO6Ou83k=', 'Admin', 'User', 1, GETUTCDATE(), NEWID());
END
SET @AdminUserId = (SELECT Id FROM Users WHERE Email = 'admin@example.com');

-- LEADERS
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'leader@example.com')
BEGIN
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId, AddedById)
    VALUES ('leader@example.com', 'rRgO6Fn88OwNTmZ3RdvF6Q==;YSnvL5y3gUymscMrfkw2A8QFq172PGPuVpNi189472c=', 'Lead', 'User', 1, GETUTCDATE(), NEWID(), @AdminUserId);
END
SET @Leader1Id = (SELECT Id FROM Users WHERE Email = 'leader@example.com');

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'leader2@example.com')
BEGIN
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId, AddedById)
    VALUES ('leader2@example.com', '/Mq1VCSli7o2tzAn6oTV6Q==;DxiYQJXppFnkepjHAAB/UfLywrY4C9ONIVKvXuMCw0Q=', 'Second', 'Leader', 1, GETUTCDATE(), NEWID(), @AdminUserId);
END
SET @Leader2Id = (SELECT Id FROM Users WHERE Email = 'leader2@example.com');

-- VENDORS
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'vendor@example.com')
BEGIN
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId, AddedById)
    VALUES ('vendor@example.com', 'aDFzZFm2bkV2aWW3APVpzw==;OV6teR+9jhsN2gJZsZW3/W8wf2Z3EHwZKGDGDxTrOXs=', 'Vendor', 'One', 1, GETUTCDATE(), NEWID(), @Leader1Id);
END
SET @Vendor1UserId = (SELECT Id FROM Users WHERE Email = 'vendor@example.com');

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'vendor2@example.com')
BEGIN
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId, AddedById)
    VALUES ('vendor2@example.com', 'FJchHWIkna+UTT9g5DPpTQ==;yLxZaSzrLuQW89JdJXMYtvCQTX5BBkE2Z2znRMd17FU=', 'Vendor', 'Two', 1, GETUTCDATE(), NEWID(), @Leader1Id);
END
SET @Vendor2UserId = (SELECT Id FROM Users WHERE Email = 'vendor2@example.com');

IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'vendor3@example.com')
BEGIN
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, PublicId, AddedById)
    VALUES ('vendor3@example.com', 'JuxGSF9QrH+Pa8GwU/+Vnw==;PdWqOygp4J8GCDEl2w33DnRcuPyvzj61Y7zYAEiIOSQ=', 'Vendor', 'Three', 1, GETUTCDATE(), NEWID(), @Leader2Id);
END
SET @Vendor3UserId = (SELECT Id FROM Users WHERE Email = 'vendor3@example.com');


-- 3. LINK USERS TO ROLES
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UsersId = @AdminUserId AND RolesId = @RoleAdminId) INSERT INTO UserRoles (UsersId, RolesId) VALUES (@AdminUserId, @RoleAdminId);
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UsersId = @Leader1Id AND RolesId = @RoleLeaderId) INSERT INTO UserRoles (UsersId, RolesId) VALUES (@Leader1Id, @RoleLeaderId);
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UsersId = @Leader2Id AND RolesId = @RoleLeaderId) INSERT INTO UserRoles (UsersId, RolesId) VALUES (@Leader2Id, @RoleLeaderId);
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UsersId = @Vendor1UserId AND RolesId = @RoleVendorId) INSERT INTO UserRoles (UsersId, RolesId) VALUES (@Vendor1UserId, @RoleVendorId);
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UsersId = @Vendor2UserId AND RolesId = @RoleVendorId) INSERT INTO UserRoles (UsersId, RolesId) VALUES (@Vendor2UserId, @RoleVendorId);
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UsersId = @Vendor3UserId AND RolesId = @RoleVendorId) INSERT INTO UserRoles (UsersId, RolesId) VALUES (@Vendor3UserId, @RoleVendorId);


-- 4. CREATE VENDOR RECORDS
IF NOT EXISTS (SELECT 1 FROM Vendors WHERE CompanyName = 'Sample Vendor Co')
BEGIN
    INSERT INTO Vendors (CompanyName, ContactEmail, Country, Status, IsActive, UserId, AddedById, CreatedAt, PublicId)
    VALUES ('Sample Vendor Co', 'vendor@example.com', 'United States', 'Active', 1, @Vendor1UserId, @Leader1Id, GETUTCDATE(), NEWID());
END
SET @Vendor1Id = (SELECT Id FROM Vendors WHERE CompanyName = 'Sample Vendor Co');

IF NOT EXISTS (SELECT 1 FROM Vendors WHERE CompanyName = 'Tech Recruiters Inc')
BEGIN
    INSERT INTO Vendors (CompanyName, ContactEmail, Country, Status, IsActive, UserId, AddedById, CreatedAt, PublicId)
    VALUES ('Tech Recruiters Inc', 'vendor2@example.com', 'United States', 'Active', 1, @Vendor2UserId, @Leader1Id, GETUTCDATE(), NEWID());
END
SET @Vendor2Id = (SELECT Id FROM Vendors WHERE CompanyName = 'Tech Recruiters Inc');

IF NOT EXISTS (SELECT 1 FROM Vendors WHERE CompanyName = 'Global Talent')
BEGIN
    INSERT INTO Vendors (CompanyName, ContactEmail, Country, Status, IsActive, UserId, AddedById, CreatedAt, PublicId)
    VALUES ('Global Talent', 'vendor3@example.com', 'Canada', 'Active', 1, @Vendor3UserId, @Leader2Id, GETUTCDATE(), NEWID());
END
SET @Vendor3Id = (SELECT Id FROM Vendors WHERE CompanyName = 'Global Talent');


-- 5. CREATE JOBS
IF NOT EXISTS (SELECT 1 FROM Jobs WHERE Title = 'Senior Developer')
BEGIN
    INSERT INTO Jobs (PublicId, Title, Description, Country, CreatedAt, ExpiryDate, IsActive, CreatedByLeaderId, Status)
    VALUES (NEWID(), 'Senior Developer', 'Looking for an experienced SDE.', 'United States', GETUTCDATE(), DATEADD(month, 3, GETUTCDATE()), 1, @Leader1Id, 0); -- 0=Open
END
SET @SdeJobId = (SELECT Id FROM Jobs WHERE Title = 'Senior Developer');

IF NOT EXISTS (SELECT 1 FROM Jobs WHERE Title = 'Engineering Manager')
BEGIN
    INSERT INTO Jobs (PublicId, Title, Description, Country, CreatedAt, ExpiryDate, IsActive, CreatedByLeaderId, Status)
    VALUES (NEWID(), 'Engineering Manager', 'Lead a team of talented engineers.', 'Canada', GETUTCDATE(), DATEADD(month, 6, GETUTCDATE()), 1, @Leader2Id, 1); -- 1=OnHold
END
SET @ManagerJobId = (SELECT Id FROM Jobs WHERE Title = 'Engineering Manager');


-- 6. ASSIGN VENDORS TO JOBS
IF NOT EXISTS (SELECT 1 FROM JobVendors WHERE JobId = @SdeJobId AND VendorId = @Vendor1Id) INSERT INTO JobVendors(JobId, VendorId) VALUES (@SdeJobId, @Vendor1Id);
IF NOT EXISTS (SELECT 1 FROM JobVendors WHERE JobId = @SdeJobId AND VendorId = @Vendor2Id) INSERT INTO JobVendors(JobId, VendorId) VALUES (@SdeJobId, @Vendor2Id);
IF NOT EXISTS (SELECT 1 FROM JobVendors WHERE JobId = @ManagerJobId AND VendorId = @Vendor3Id) INSERT INTO JobVendors(JobId, VendorId) VALUES (@ManagerJobId, @Vendor3Id);


-- 7. CREATE EMPLOYEES
IF NOT EXISTS (SELECT 1 FROM Employees WHERE Email = 'john.doe@email.com')
BEGIN
    INSERT INTO Employees (PublicId, IsActive, FirstName, LastName, JobTitle, ResumeS3Key, CreatedAt, VendorId, JobId, CreatedByUserId, Email, PhoneNumber, YearsOfExperience, Skills)
    VALUES (NEWID(), 1, 'John', 'Doe', 'Backend Dev', 'resume-key-1.pdf', GETUTCDATE(), @Vendor1Id, @SdeJobId, @Vendor1UserId, 'john.doe@email.com', '111-222-3333', 5, 'C#, .NET, SQL');
END
SET @Emp1Id = (SELECT Id FROM Employees WHERE Email = 'john.doe@email.com');

IF NOT EXISTS (SELECT 1 FROM Employees WHERE Email = 'jane.smith@email.com')
BEGIN
    INSERT INTO Employees (PublicId, IsActive, FirstName, LastName, JobTitle, ResumeS3Key, CreatedAt, VendorId, JobId, CreatedByUserId, Email, PhoneNumber, YearsOfExperience, Skills)
    VALUES (NEWID(), 1, 'Jane', 'Smith', 'Frontend Dev', 'resume-key-2.pdf', GETUTCDATE(), @Vendor1Id, @SdeJobId, @Vendor1UserId, 'jane.smith@email.com', '444-555-6666', 3, 'Angular, TypeScript');
END
SET @Emp2Id = (SELECT Id FROM Employees WHERE Email = 'jane.smith@email.com');

IF NOT EXISTS (SELECT 1 FROM Employees WHERE Email = 'peter.jones@email.com')
BEGIN
    INSERT INTO Employees (PublicId, IsActive, FirstName, LastName, JobTitle, ResumeS3Key, CreatedAt, VendorId, JobId, CreatedByUserId, Email, PhoneNumber, YearsOfExperience, Skills)
    VALUES (NEWID(), 1, 'Peter', 'Jones', 'Fullstack Dev', 'resume-key-3.pdf', GETUTCDATE(), @Vendor2Id, @SdeJobId, @Vendor2UserId, 'peter.jones@email.com', '777-888-9999', 8, 'React, Node.js, AWS');
END
SET @Emp3Id = (SELECT Id FROM Employees WHERE Email = 'peter.jones@email.com');

IF NOT EXISTS (SELECT 1 FROM Employees WHERE Email = 'susan.lee@email.com')
BEGIN
    INSERT INTO Employees (PublicId, IsActive, FirstName, LastName, JobTitle, ResumeS3Key, CreatedAt, VendorId, JobId, CreatedByUserId, Email, PhoneNumber, YearsOfExperience, Skills)
    VALUES (NEWID(), 1, 'Susan', 'Lee', 'Team Lead', 'resume-key-4.pdf', GETUTCDATE(), @Vendor3Id, @ManagerJobId, @Vendor3UserId, 'susan.lee@email.com', '123-456-7890', 10, 'Management, C#, Azure');
END
SET @Emp4Id = (SELECT Id FROM Employees WHERE Email = 'susan.lee@email.com');


-- 8. CREATE JOB APPLICATIONS
IF NOT EXISTS (SELECT 1 FROM JobApplications WHERE JobId = @SdeJobId AND EmployeeId = @Emp1Id)
BEGIN
    INSERT INTO JobApplications (PublicId, JobId, EmployeeId, Status, LastUpdatedAt, Feedback)
    VALUES (NEWID(), @SdeJobId, @Emp1Id, 1, GETUTCDATE(), 'Strong backend experience. Good for first-round interview.'); -- 1=UnderReview
END;

IF NOT EXISTS (SELECT 1 FROM JobApplications WHERE JobId = @SdeJobId AND EmployeeId = @Emp2Id)
BEGIN
    INSERT INTO JobApplications (PublicId, JobId, EmployeeId, Status, LastUpdatedAt)
    VALUES (NEWID(), @SdeJobId, @Emp2Id, 0, GETUTCDATE()); -- 0=Submitted
END;

IF NOT EXISTS (SELECT 1 FROM JobApplications WHERE JobId = @SdeJobId AND EmployeeId = @Emp3Id)
BEGIN
    INSERT INTO JobApplications (PublicId, JobId, EmployeeId, Status, LastUpdatedAt)
    VALUES (NEWID(), @SdeJobId, @Emp3Id, 2, GETUTCDATE()); -- 2=ScheduledForInterview
END;

IF NOT EXISTS (SELECT 1 FROM JobApplications WHERE JobId = @ManagerJobId AND EmployeeId = @Emp4Id)
BEGIN
    INSERT INTO JobApplications (PublicId, JobId, EmployeeId, Status, LastUpdatedAt, Feedback)
    VALUES (NEWID(), @ManagerJobId, @Emp4Id, 4, GETUTCDATE(), 'Excellent candidate, hired on the spot.'); -- 4=Hired
END;

GO