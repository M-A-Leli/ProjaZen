-- Procedure to get a user by ID
CREATE PROCEDURE GetUserById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT * FROM Users WHERE Id = @Id;
END;
GO
