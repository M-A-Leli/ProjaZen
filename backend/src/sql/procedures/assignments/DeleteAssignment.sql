-- Procedure to delete an assignment
CREATE PROCEDURE DeleteAssignment
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    DELETE FROM Assignments WHERE Id = @Id;
END;
GO
