-- Procedure to mark a project as completed
CREATE PROCEDURE MarkProjectAsCompleted
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    UPDATE Projects SET Status = 'completed' WHERE Id = @Id;
END;
GO
