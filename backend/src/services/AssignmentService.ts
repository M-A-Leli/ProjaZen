import createError from 'http-errors';
import Assignment from '../models/Assignment';
import User from '../models/User';
import Project from '../models/Project';
import sequelize from '../database/SequelizeInit';
import Notification from '../models/Notification';
import NotificationService from './NotificationService';

class AssignmentService {

    async getAssignmentById(id: string) {
        try {
            const user = await Assignment.findByPk(id);
            if (!user) {
                throw createError(404, 'Assignment not found');
            }
            return user;
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

    async assignUserToProject(projectId: string, userId: string) {
        const transaction = await sequelize.transaction();

        try {
            const project = await Project.findByPk(projectId, { transaction });
            if (!project) {
                throw createError(404, 'Project not found');
            }

            const user = await User.findByPk(userId, { transaction });
            if (!user) {
                throw createError(404, 'User not found');
            }

            const userUnavailable = await Assignment.findOne({ where: { userId }, transaction });
            if (userUnavailable) {
                throw createError(400, 'User already assigned to a project');
            }

            // const existingAssignment = await Assignment.findOne({ where: { projectId, userId }, transaction });
            // if (existingAssignment) {
            //     throw createError(400, 'User already assigned to the project');
            // }

            const newAssignment = await Assignment.create({ projectId, userId }, { transaction });

            project.status = 'Assigned';
            await project.save({ transaction });

            // const notification: Notification = {
            //     userId: userId,
            //     message: `You have been assigned to project ${project.name}`,
            //     read: false
            // }

            // await NotificationService.createNotification(notification);

            await transaction.commit();

            return newAssignment;
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

    async unassignUserFromProject(projectId: string, userId: string) {
        const transaction = await sequelize.transaction();

        try {
            const project = await Project.findByPk(projectId, { transaction });
            if (!project) {
                throw createError(404, 'Project not found');
            }

            const assignment = await Assignment.findOne({ where: { projectId, userId }, transaction });
            if (!assignment) {
                throw createError(404, 'Assignment not found');
            }

            await assignment.destroy({ transaction });

            // If the project is unassigned, update its status
            const remainingAssignments = await Assignment.findAll({ where: { projectId }, transaction });
            if (remainingAssignments.length === 0) {
                project.status = 'Unassigned';
                await project.save({ transaction });
            }

            await transaction.commit();

            return true;
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
}

export default new AssignmentService();
