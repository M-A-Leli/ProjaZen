-- Procedure to delete a user
CREATE PROCEDURE DeleteUser
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    DELETE FROM Users WHERE Id = @Id;
END;
GO
