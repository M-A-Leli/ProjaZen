-- Procedure to delete a project
CREATE PROCEDURE DeleteProject
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    DELETE FROM Projects WHERE Id = @Id;
END;
GO
