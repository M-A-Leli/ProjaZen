-- Procedure to delete a example
CREATE PROCEDURE DeleteExample
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    DELETE FROM Examples WHERE Id = @Id;
END;
