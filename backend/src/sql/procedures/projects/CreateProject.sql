-- Procedure to create a new project
CREATE PROCEDURE CreateProject
    @Id UNIQUEIDENTIFIER,
    @Name NVARCHAR(100),
    @Description NVARCHAR(255),
    @StartDate DATE,
    @EndDate DATE,
    @Status NVARCHAR(50)
AS
BEGIN
    INSERT INTO Projects (Id, Name, Description, StartDate, EndDate, Status, createdAt, updatedAt)
    VALUES (@Id, @Name, @Description, @StartDate, @EndDate, @Status, GETDATE(), GETDATE());
END;
GO
