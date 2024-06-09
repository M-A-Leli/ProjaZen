-- Procedure to create a new assignment (assign user to project)
CREATE PROCEDURE AssignUserToProject
    @Id UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER,
    @ProjectId UNIQUEIDENTIFIER
AS
BEGIN
    -- Update project status to 'assigned'
    UPDATE Projects SET Status = 'assigned' WHERE Id = @ProjectId;

    -- Insert assignment
    INSERT INTO Assignments (Id, UserId, ProjectId, createdAt, updatedAt)
    VALUES (@Id, @UserId, @ProjectId, GETDATE(), GETDATE());
END;
GO

-- Procedure to unassign a user from a project
CREATE PROCEDURE UnassignUserFromProject
    @UserId UNIQUEIDENTIFIER,
    @ProjectId UNIQUEIDENTIFIER
AS
BEGIN
    -- Update project status to 'unassigned' if no more assignments
    IF NOT EXISTS (SELECT * FROM Assignments WHERE ProjectId = @ProjectId AND UserId <> @UserId)
    BEGIN
        UPDATE Projects SET Status = 'unassigned' WHERE Id = @ProjectId;
    END;

    -- Delete assignment
    DELETE FROM Assignments WHERE UserId = @UserId AND ProjectId = @ProjectId;
END;
GO
