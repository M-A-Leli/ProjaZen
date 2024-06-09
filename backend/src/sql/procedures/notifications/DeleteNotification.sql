-- Procedure to delete a notification
CREATE PROCEDURE DeleteNotification
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    DELETE FROM Notifications WHERE Id = @Id;
END;
GO
