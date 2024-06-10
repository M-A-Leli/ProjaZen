-- Create the database
CREATE DATABASE ProjaZen;
GO

-- Use the newly created database
USE ProjaZen;
GO

-- Create the User table
CREATE TABLE Users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    fname NVARCHAR(50) NOT NULL,
    lname NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    salt NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL DEFAULT 'user',
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Create the Project table
CREATE TABLE Projects (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    status NVARCHAR(50) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Create the Assignment table
CREATE TABLE Assignments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userId UNIQUEIDENTIFIER NOT NULL,
    projectId UNIQUEIDENTIFIER NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (projectId) REFERENCES Projects(id)
);
GO

-- Create the Notification table
CREATE TABLE Notifications (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userId UNIQUEIDENTIFIER NOT NULL,
    message NVARCHAR(255) NOT NULL,
    [read] BIT NOT NULL DEFAULT 0,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id)
);
GO

-- Insert 10 users
INSERT INTO Users (fname, lname, email, password, salt, role) VALUES
('John', 'Doe', 'john.doe@example.com', '$2a$10$pX8Gd4i37SZj.RfLjjdfj.ZnQKKKb0so6n3Gw29HHLMIsOdzwMcAK', '$2a$10$pX8Gd4i37SZj.RfLjjdfj.', 'admin'),
('Jane', 'Smith', 'jane.smith@example.com', '$2a$10$RdGOixnFRh4UIoiNKj8kJu93qXWSXAcgVjqPepM9/oYUcP35Jthoq', '$2a$10$RdGOixnFRh4UIoiNKj8kJu', 'user'),
('Alice', 'Johnson', 'alice.johnson@example.com', '$2a$10$QKeMjDrENA21woPYugd4numGn4czt69beauWD0aguemplEK7fa59W', '$2a$10$QKeMjDrENA21woPYugd4nu', 'user'),
('Bob', 'Brown', 'bob.brown@example.com', '$2a$10$hiV3HZ4JhEDULFcN5HUTSOCDZyj3kMZR8hGcS4D2juCikTvNBMQSm', '$2a$10$hiV3HZ4JhEDULFcN5HUTSO', 'user'),
('Charlie', 'Davis', 'charlie.davis@example.com', '$2a$10$nN.VTzvn4ZRQTjgsRP4oquK88B0e3hRuUCpIPSVvWTct2zDWNdRVa', '$2a$10$nN.VTzvn4ZRQTjgsRP4oqu', 'user'),
('Eve', 'Miller', 'eve.miller@example.com', '$2a$10$6HWr3FwEtSg0Y0qOL.GUDOyF5HBH5AmtF.Jz8iT6s8utH/88ulWQS', '$2a$10$6HWr3FwEtSg0Y0qOL.GUDO', 'user'),
('Frank', 'Wilson', 'frank.wilson@example.com', '$2a$10$VaohJuRBa77qYr65GQIlROGWPHi3jDjHRE2AZ5cyD19k1kcfFtlbG', '$2a$10$VaohJuRBa77qYr65GQIlRO', 'user'),
('Grace', 'Moore', 'grace.moore@example.com', '$2a$10$23YqJVQxWpdlHJuTwR.Z1ulCiDqYHQtVGFYGw7vMV/VcjoiytlMYm', '$2a$10$23YqJVQxWpdlHJuTwR.Z1u', 'user'),
('Henry', 'Taylor', 'henry.taylor@example.com', '$2a$10$dBMCVhr4Y5ttUlHoA8DP7OVga43ZoH1amYotTaBNpwXFPSpHOb3bO', '$2a$10$g9QeL.vHdmNsdO44iPYnyu', 'user'),
('Ivy', 'Anderson', 'ivy.anderson@example.com', '$2a$10$Z/GfIafwk.jgNI8YATxdRe0tEC/6PGCWJaZUNQKJEJHB.gyCKZdPS', '$2a$10$Z/GfIafwk.jgNI8YATxdRe', 'user');
GO

-- Insert 10 projects
INSERT INTO Projects (name, description, startDate, endDate, status) VALUES
('Project Alpha', 'Description for Project Alpha', '2024-01-01', '2024-06-30', 'unassigned'),
('Project Beta', 'Description for Project Beta', '2024-02-01', '2024-07-31', 'assigned'),
('Project Gamma', 'Description for Project Gamma', '2024-03-01', '2024-08-31', 'completed'),
('Project Delta', 'Description for Project Delta', '2024-04-01', '2024-09-30', 'overdue'),
('Project Epsilon', 'Description for Project Epsilon', '2024-05-01', '2024-10-31', 'expired'),
('Project Zeta', 'Description for Project Zeta', '2024-06-01', '2024-11-30', 'unassigned'),
('Project Eta', 'Description for Project Eta', '2024-07-01', '2024-12-31', 'assigned'),
('Project Theta', 'Description for Project Theta', '2024-08-01', '2025-01-31', 'completed'),
('Project Iota', 'Description for Project Iota', '2024-09-01', '2025-02-28', 'overdue'),
('Project Kappa', 'Description for Project Kappa', '2024-10-01', '2025-03-31', 'expired');
GO

-- Insert 10 assignments
DECLARE @userId UNIQUEIDENTIFIER;
DECLARE @projectId UNIQUEIDENTIFIER;

SET @userId = (SELECT id FROM Users WHERE email = 'john.doe@example.com');
SET @projectId = (SELECT id FROM Projects WHERE name = 'Project Alpha');
INSERT INTO Assignments (userId, projectId) VALUES (@userId, @projectId);

SET @userId = (SELECT id FROM Users WHERE email = 'jane.smith@example.com');
SET @projectId = (SELECT id FROM Projects WHERE name = 'Project Beta');
INSERT INTO Assignments (userId, projectId) VALUES (@userId, @projectId);

SET @userId = (SELECT id FROM Users WHERE email = 'alice.johnson@example.com');
SET @projectId = (SELECT id FROM Projects WHERE name = 'Project Gamma');
INSERT INTO Assignments (userId, projectId) VALUES (@userId, @projectId);

SET @userId = (SELECT id FROM Users WHERE email = 'bob.brown@example.com');
SET @projectId = (SELECT id FROM Projects WHERE name = 'Project Delta');
INSERT INTO Assignments (userId, projectId) VALUES (@userId, @projectId);

SET @userId = (SELECT id FROM Users WHERE email = 'charlie.davis@example.com');
SET @projectId = (SELECT id FROM Projects WHERE name = 'Project Epsilon');
INSERT INTO Assignments (userId, projectId) VALUES (@userId, @projectId);

SET @userId = (SELECT id FROM Users WHERE email = 'eve.miller@example.com');
SET @projectId = (SELECT id FROM Projects WHERE name = 'Project Zeta');
INSERT INTO Assignments (userId, projectId) VALUES (@userId, @projectId);

SET @userId = (SELECT id FROM Users WHERE email = 'frank.wilson@example.com');
SET @projectId = (SELECT id FROM Projects WHERE name = 'Project Eta');
INSERT INTO Assignments (userId, projectId) VALUES (@userId, @projectId);

SET @userId = (SELECT id FROM Users WHERE email = 'grace.moore@example.com');
SET @projectId = (SELECT id FROM Projects WHERE name = 'Project Theta');
INSERT INTO Assignments (userId, projectId) VALUES (@userId, @projectId);

SET @userId = (SELECT id FROM Users WHERE email = 'henry.taylor@example.com');
SET @projectId = (SELECT id FROM Projects WHERE name = 'Project Iota');
INSERT INTO Assignments (userId, projectId) VALUES (@userId, @projectId);

SET @userId = (SELECT id FROM Users WHERE email = 'ivy.anderson@example.com');
SET @projectId = (SELECT id FROM Projects WHERE name = 'Project Kappa');
INSERT INTO Assignments (userId, projectId) VALUES (@userId, @projectId);
GO

-- Insert 10 notifications
DECLARE @userId UNIQUEIDENTIFIER;
DECLARE @projectId UNIQUEIDENTIFIER;

SET @userId = (SELECT id FROM Users WHERE email = 'john.doe@example.com');
INSERT INTO Notifications (userId, message) VALUES
(@userId, 'Notification for John Doe');

SET @userId = (SELECT id FROM Users WHERE email = 'jane.smith@example.com');
INSERT INTO Notifications (userId, message) VALUES
(@userId, 'Notification for Jane Smith');

SET @userId = (SELECT id FROM Users WHERE email = 'alice.johnson@example.com');
INSERT INTO Notifications (userId, message) VALUES
(@userId, 'Notification for Alice Johnson');

SET @userId = (SELECT id FROM Users WHERE email = 'bob.brown@example.com');
INSERT INTO Notifications (userId, message) VALUES
(@userId, 'Notification for Bob Brown');

SET @userId = (SELECT id FROM Users WHERE email = 'charlie.davis@example.com');
INSERT INTO Notifications (userId, message) VALUES
(@userId, 'Notification for Charlie Davis');

SET @userId = (SELECT id FROM Users WHERE email = 'eve.miller@example.com');
INSERT INTO Notifications (userId, message) VALUES
(@userId, 'Notification for Eve Miller');

SET @userId = (SELECT id FROM Users WHERE email = 'frank.wilson@example.com');
INSERT INTO Notifications (userId, message) VALUES
(@userId, 'Notification for Frank Wilson');

SET @userId = (SELECT id FROM Users WHERE email = 'grace.moore@example.com');
INSERT INTO Notifications (userId, message) VALUES
(@userId, 'Notification for Grace Moore');

SET @userId = (SELECT id FROM Users WHERE email = 'henry.taylor@example.com');
INSERT INTO Notifications (userId, message) VALUES
(@userId, 'Notification for Henry Taylor');

SET @userId = (SELECT id FROM Users WHERE email = 'ivy.anderson@example.com');
INSERT INTO Notifications (userId, message) VALUES
(@userId, 'Notification for Ivy Anderson');
GO
