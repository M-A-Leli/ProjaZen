-- Procedure to get assignments for a specific project
CREATE PROCEDURE GetAssignmentsForProject
    @ProjectId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT A.Id, U.fname + ' ' + U.lname AS UserName
    FROM Assignments A
    INNER JOIN Users U ON A.UserId = U.Id
    WHERE A.ProjectId = @ProjectId;
END;
GO
