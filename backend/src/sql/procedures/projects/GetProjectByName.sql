-- Procedure to get project by name
CREATE PROCEDURE GetProjectByName
    @Name NVARCHAR(100)
AS
BEGIN
    SELECT * FROM Projects WHERE Name = @Name;
END;
GO
