-- Procedure to get a notification by ID
CREATE PROCEDURE GetNotificationById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT * FROM Notifications WHERE Id = @Id;
END;
GO
