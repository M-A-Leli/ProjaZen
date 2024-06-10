-- Procedure to get assigned users
CREATE PROCEDURE GetAssignedUsers
AS
BEGIN
    SELECT * FROM Users WHERE Id IN (SELECT UserId FROM Assignments);
END;
GO
