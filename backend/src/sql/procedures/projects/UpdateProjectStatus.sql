-- Procedure to update project's status
CREATE PROCEDURE UpdateProjectStatus
    @Id UNIQUEIDENTIFIER,
    @Status NVARCHAR(50)
AS
BEGIN
    UPDATE Projects
    SET Status = @Status,
        UpdatedAt = GETDATE()
    WHERE Id = @Id;
END;
