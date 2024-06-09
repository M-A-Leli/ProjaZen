-- Procedure to create a new example
CREATE PROCEDURE CreateExample
    @Id UNIQUEIDENTIFIER,
    @Attr1 NVARCHAR(30),
    @Attr2 NVARCHAR(255)
AS
BEGIN
    INSERT INTO Examples (Id, Attr1, Attr2)
    VALUES (@Id, @Attr1, @Attr2);
END;
