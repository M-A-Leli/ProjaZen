-- Procedure to update a user
CREATE PROCEDURE UpdateUser
    @Id UNIQUEIDENTIFIER,
    @Fname NVARCHAR(50),
    @Lname NVARCHAR(50),
    @Email NVARCHAR(100),
    @Password NVARCHAR(255),
    @Salt NVARCHAR(255),
    @Role NVARCHAR(50)
AS
BEGIN
    UPDATE Users
    SET Fname = @Fname,
        Lname = @Lname,
        Email = @Email,
        Password = @Password,
        Salt = @Salt,
        Role = @Role,
        updatedAt = GETDATE()
    WHERE Id = @Id;

    SELECT * FROM Users WHERE Id = @Id;
END;
GO
