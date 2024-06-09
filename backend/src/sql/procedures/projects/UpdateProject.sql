-- Procedure to update a project
CREATE PROCEDURE UpdateProject
    @Id UNIQUEIDENTIFIER,
    @Name NVARCHAR(100),
    @Description NVARCHAR(255),
    @StartDate DATE,
    @EndDate DATE,
    @Status NVARCHAR(50)
AS
BEGIN
    UPDATE Projects
    SET Name = @Name,
        Description = @Description,
        StartDate = @StartDate,
        EndDate = @EndDate,
        Status = @Status,
        updatedAt = GETDATE()
    WHERE Id = @Id;

    SELECT * FROM Projects WHERE Id = @Id;
END;
GO
