-- Procedure to create a new notification
CREATE PROCEDURE CreateNotification
    @Id UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER,
    @Message NVARCHAR(255),
    @Read BIT = 0
AS
BEGIN
    INSERT INTO Notifications (Id, UserId, Message, [Read], createdAt, updatedAt)
    VALUES (@Id, @UserId, @Message, @Read, GETDATE(), GETDATE());
END;
GO
