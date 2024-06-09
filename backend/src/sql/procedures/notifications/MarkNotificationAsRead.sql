-- Procedure to mark a notification as read
CREATE PROCEDURE MarkNotificationAsRead
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    UPDATE Notifications SET [Read] = 1 WHERE Id = @Id;
END;
GO
