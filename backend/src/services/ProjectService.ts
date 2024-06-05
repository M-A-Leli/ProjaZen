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
            throw createError(500, `Error fetching all projects: ${error}`);
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
            throw createError(500, `Error fetching project by ID: ${error}`);
        }
    }

    async createProject(projectData: any) {
        try {
            const newProject = await Project.create(projectData);
            return newProject;
        } catch (error) {
            throw createError(500, `Error creating project: ${error}`);
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
            throw createError(500, `Error updating project by ID: ${error}`);
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
            throw createError(500, `Error deleting project by ID: ${error}`);
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
            throw createError(500, `Error fetching ${status} projects: ${error}`);
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
            throw createError(500, `Error fetching product by name: ${error}`);
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
            throw createError(500, `Error changing project status: ${error}`);
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
            throw createError(500, `Error marking project as completed: ${error}`);
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
            throw createError(500, `Error handling project end dates: ${error}`);
        }
    }
}

export default new ProjectService();
