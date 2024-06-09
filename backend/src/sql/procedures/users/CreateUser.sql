-- Procedure to create a new user
CREATE PROCEDURE CreateUser
    @Id UNIQUEIDENTIFIER,
    @Fname NVARCHAR(50),
    @Lname NVARCHAR(50),
    @Email NVARCHAR(100),
    @Password NVARCHAR(255),
    @Salt NVARCHAR(255),
    @Role NVARCHAR(50) = 'user'
AS
BEGIN
    INSERT INTO Users (Id, Fname, Lname, Email, Password, Salt, Role, createdAt, updatedAt)
    VALUES (@Id, @Fname, @Lname, @Email, @Password, @Salt, @Role, GETDATE(), GETDATE());
END;
GO
