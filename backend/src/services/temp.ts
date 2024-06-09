async handleEndDates() {
    try {
        const now = new Date();
        const projects = await Project.findAll({
            where: {
                endDate: { [Op.lte]: now },
                status: { [Op.ne]: 'Completed' }
            }
        });

        for (const project of projects) {
            if (project.status === 'Unassigned') {
                project.status = 'Expired';
            } else if (project.status === 'Assigned') {
                project.status = 'Overdue';
            }
            await project.save();
        }
    } catch (error) {
        if (error instanceof createError.HttpError) {
            throw error;
        } else if (error instanceof Error) {
            throw createError(500, `Unexpected error: ${error.message}`);
        } else {
            throw createError(500, 'Unexpected error occurred');
        }
    }
}