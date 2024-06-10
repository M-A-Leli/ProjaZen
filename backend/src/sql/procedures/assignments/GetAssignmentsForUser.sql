-- Procedure to get assignments for a specific user
CREATE PROCEDURE GetAssignmentsForUser
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT A.Id, P.Name AS ProjectName
    FROM Assignments A
    INNER JOIN Projects P ON A.ProjectId = P.Id
    WHERE A.UserId = @UserId;
END;
GO
