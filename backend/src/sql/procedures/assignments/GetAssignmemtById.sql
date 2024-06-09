-- Procedure to get assignment by ID with user's full name and project's name
CREATE PROCEDURE GetAssignmentById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT A.Id, U.fname + ' ' + U.lname AS UserName, P.Name AS ProjectName
    FROM Assignments A
    INNER JOIN Users U ON A.UserId = U.Id
    INNER JOIN Projects P ON A.ProjectId = P.Id
    WHERE A.Id = @Id;
END;
GO
