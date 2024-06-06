import { Op, where } from 'sequelize';
import createError from 'http-errors';
import Project from '../models/Project';
import Assignment from '../models/Assignment';
import sequelize from '../database/SequelizeInit';

class ProjectService {
    async getAllProjects() {
        try {
            return await Project.findAll();
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

    async getProjectById(id: string) {
        try {
            const project = await Project.findByPk(id);
            if (!project) {
                throw createError(404, 'Project not found');
            }
            return project;
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

    async createProject(projectData: any) {
        try {
            const existingProject = await Project.findOne({ where: { name: projectData.name } });
            
            if (existingProject) {
                throw createError(409, 'Project already exists');
            }

            const newProject = await Project.create(projectData);
            return newProject;
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

    async updateProject(id: string, updateData: any) {
        try {
            const project = await Project.findByPk(id);
            if (!project) {
                throw createError(404, 'Project not found');
            }
            await project.update(updateData);
            return project;
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

    async deleteProject(id: string) {
        try {
            const project = await Project.findByPk(id);
            if (!project) {
                throw createError(404, 'Project not found');
            }
            await project.destroy();
            return true;
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
    
    async getProjectsByStatus(status: string) {
        try {
            const projects = await Project.findAll({ where: {status} });
            if (!projects) {
                throw createError(404, `${status} projects not found`);
            }
            return projects;
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

    async getProjectsByName(name: string) {
        try {
            const project = await Project.findOne({ where: {name} });
            if (!project) {
                throw createError(404, `Project not found`);
            }
            return project;
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

    async changeProjectStatus(id: string, status: string) {
        try {
            const project = await Project.findByPk(id);
            if (!project) {
                throw createError(404, 'Project not found');
            }

            if (!['Unassigned', 'Assigned', 'Completed'].includes(status)) {
                throw createError(400, 'Invalid status');
            }

            //Cannot complete a project that's not assigned
            if (status === 'Completed' && project.status !== 'Assigned') {
                throw createError(400, 'Cannot complete a project that is not assigned');
            }

            project.status = status;
            await project.save();

            return project;
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

    // async markProjectAsCompleted(id: string) {
    //     try {
    //         const project = await Project.findByPk(id);
    //         if (!project) {
    //             throw createError(404, 'Project not found');
    //         }

    //         project.status = 'Completed';
    
    //         await project.save();
    
    //         return project;
    //     } catch (error) {
    //         throw createError(500, `Error marking project ${id} as completed`);
    //     }
    // }

    async markProjectAsCompleted(id: string) {
        const transaction = await sequelize.transaction();

        try {
            const project = await Project.findByPk(id, { transaction });
            if (!project) {
                throw createError(404, 'Project not found');
            }

            project.status = 'Completed';
            await project.save({ transaction });

            // const assignment = await Assignment.findOne({ where: { projectId: id }, transaction });
            // if (assignment) {
            //     await assignment.destroy({ transaction });
            // }

            // await NotificationService.createNotification(assignment.userId, `Project ${project.name} has been marked as completed`);
            // await NotificationService.createNotification(adminId, `Project ${project.name} has been completed by user ${assignment.userId}`);

            await transaction.commit();

            return project;
        } catch (error) {
            await transaction.rollback();
            if (error instanceof createError.HttpError) {
                throw error;
            } else if (error instanceof Error) {
                throw createError(500, `Unexpected error: ${error.message}`);
            } else {
                throw createError(500, 'Unexpected error occurred');
            }
        }
    }

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
}

export default new ProjectService();
