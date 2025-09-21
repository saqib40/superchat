USE superchat;
GO

-- We only need to declare variables for User IDs now.
DECLARE @AdminUserId INT, @LeaderUserId INT, @VendorUserId INT, @Admin2UserId INT;

-- Create the users and capture their new IDs
-- (Password: hlo123)
INSERT INTO Users (Email, PasswordHash, FirstName, LastName, CreatedAt)
VALUES ('admin@example.com', '$2a$11$2HWtCEy9K7FrQ8OhbHVSROTysfkZeIVJhj33XNnycVsLU.OZAJb3a', 'Admin', 'User', GETUTCDATE());
SET @AdminUserId = SCOPE_IDENTITY();

-- (Password: hii12345)
INSERT INTO Users (Email, PasswordHash, FirstName, LastName, CreatedAt)
VALUES ('leader@example.com', '$2a$11$cGlnksQmEeWoIhatkVp0qOWZQwWDVqMliz.ojsDahTMcwJZFXqMmO', 'Lead', 'User', GETUTCDATE());
SET @LeaderUserId = SCOPE_IDENTITY();

-- (Password: 12345)
INSERT INTO Users (Email, PasswordHash, FirstName, LastName, CreatedAt)
VALUES ('vendor@example.com', '$2a$11$MzIx4iNXZcvMwI1aXiWZYOqu9.3vldQMttpVzGvBbJu0dY9jTkEx2', 'Vendor', 'User', GETUTCDATE());
SET @VendorUserId = SCOPE_IDENTITY();

-- (Password: 1234)
INSERT INTO Users (Email, PasswordHash, FirstName, LastName, CreatedAt)
VALUES ('admin2@example.com', '$2a$11$q3O37DeSy/3mnvN2Rzq37uWkfLrN6mswFFgaOCZbX4uIjuBSjqrai', 'Admin', 'Two', GETUTCDATE());
SET @Admin2UserId = SCOPE_IDENTITY();


-- Link users to roles using the known, hardcoded Role IDs
INSERT INTO UserRoles (UsersId, RolesId) VALUES (@AdminUserId, 1); -- RoleId 1 = Admin
INSERT INTO UserRoles (UsersId, RolesId) VALUES (@LeaderUserId, 2); -- RoleId 2 = Leadership
INSERT INTO UserRoles (UsersId, RolesId) VALUES (@VendorUserId, 3); -- RoleId 3 = Vendor
INSERT INTO UserRoles (UsersId, RolesId) VALUES (@Admin2UserId, 1); -- RoleId 1 = Admin
GO

-- Verify the final result
SELECT u.Email, r.Name AS RoleName
FROM Users u
JOIN UserRoles ur ON u.Id = ur.UsersId
JOIN Roles r ON ur.RolesId = r.Id;
GO