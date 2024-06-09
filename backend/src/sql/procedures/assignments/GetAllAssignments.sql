-- Procedure to get assignments with user's full name and project's name
CREATE PROCEDURE GetAssignments
AS
BEGIN
    SELECT A.Id, U.fname + ' ' + U.lname AS UserName, P.Name AS ProjectName
    FROM Assignments A
    INNER JOIN Users U ON A.UserId = U.Id
    INNER JOIN Projects P ON A.ProjectId = P.Id;
END;
GO
