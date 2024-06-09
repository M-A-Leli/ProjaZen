-- Procedure to update a example
CREATE PROCEDURE UpdateExample
    @Id UNIQUEIDENTIFIER,
    @Attr1 NVARCHAR(50),
    @Attr2 NVARCHAR(50)
AS
BEGIN
    UPDATE Examples
    SET Attr1 = @Attr1, Attr2 = @Attr2
    WHERE Id = @Id;

    SELECT * FROM Examples WHERE Id = @Id;
END;
