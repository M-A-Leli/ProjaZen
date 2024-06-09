-- Procedure to get unassigned users
CREATE PROCEDURE GetUnassignedUsers
AS
BEGIN
    SELECT * FROM Users WHERE Id NOT IN (SELECT UserId FROM Assignments);
END;
GO
