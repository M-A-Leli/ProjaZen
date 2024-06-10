-- Procedure to get notifications for a specific user
CREATE PROCEDURE GetNotificationsForUser
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT * FROM Notifications WHERE UserId = @UserId;
END;
GO
