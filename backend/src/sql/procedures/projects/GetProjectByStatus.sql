-- Procedure to get projects by status
CREATE PROCEDURE GetProjectsByStatus
    @Status NVARCHAR(50)
AS
BEGIN
    SELECT * FROM Projects WHERE Status = @Status;
END;
GO
