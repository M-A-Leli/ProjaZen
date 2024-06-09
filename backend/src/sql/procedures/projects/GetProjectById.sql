-- Procedure to get a project by ID
CREATE PROCEDURE GetProjectById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT * FROM Projects WHERE Id = @Id;
END;
GO
