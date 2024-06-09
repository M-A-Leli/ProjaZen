-- Procedure to get projects by end date
CREATE PROCEDURE GetProjectsByEndDate
    @EndDate DATETIME
AS
BEGIN
    SELECT * FROM Projects
    WHERE EndDate <= @EndDate;
END;
