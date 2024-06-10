-- Procedure to get unread notifications for a specific user
CREATE PROCEDURE GetUnreadNotificationsForUser
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT * FROM Notifications WHERE UserId = @UserId AND [Read] = 0;
END;
GO
