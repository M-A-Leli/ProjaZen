-- Procedure to create a new project
CREATE PROCEDURE CreateProject
    @Id UNIQUEIDENTIFIER OUTPUT, -- Modified to accept an OUTPUT parameter for the newly generated ID
    @Name NVARCHAR(100),
    @Description NVARCHAR(255),
    @StartDate DATE,
    @EndDate DATE,
    @Status NVARCHAR(50)
AS
BEGIN
    -- Insert the project into the Projects table
    INSERT INTO Projects (Name, Description, StartDate, EndDate, Status, createdAt, updatedAt)
    VALUES (@Name, @Description, @StartDate, @EndDate, @Status, GETDATE(), GETDATE());

    -- Set the OUTPUT parameter to the newly generated ID
    SET @Id = SCOPE_IDENTITY(); -- Retrieve the last inserted identity value

    -- Retrieve the details of the newly created project
    SELECT Id, Name, Description, StartDate, EndDate, Status, createdAt, updatedAt
    FROM Projects
    WHERE Id = @Id; -- Filter by the newly generated ID
END;

