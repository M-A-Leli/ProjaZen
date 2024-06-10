-- Procedure to get a example by ID
CREATE PROCEDURE GetExampleById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT * FROM Examples WHERE Id = @Id;
END;
