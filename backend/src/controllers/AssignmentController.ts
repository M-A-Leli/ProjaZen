import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import AssignmentService from '../services/AssignmentService';
import logger from '../utils/Logger';
import { Assignment } from '../models';

class AssignmentController {
    constructor() {
        this.assignUserToProject = this.assignUserToProject.bind(this);
        this.unassignUserFromProject = this.unassignUserFromProject.bind(this);
    }

    async assignUserToProject(req: Request, res: Response, next: NextFunction) {
        const { projectId, userId } = req.body;

        try {
            const assignment = await AssignmentService.assignUserToProject(projectId, userId);
            res.status(201).json(this.transformAssignment(assignment));
        } catch (error) {
            logger.error(`Error assigning user ${userId} to project ${projectId}:`, error);
            next(error);
        }
    }

    async unassignUserFromProject(req: Request, res: Response, next: NextFunction) {
        const { projectId, userId } = req.body;

        try {
            const existingAssignment = await AssignmentService.getAssignmentById(req.params.id);
            if (!existingAssignment) {
                return next(createError(404, 'Assignment does not exist'));
            }

            const result = await AssignmentService.unassignUserFromProject(projectId, userId);
            res.status(200).json({ success: result });
        } catch (error) {
            logger.error(`Error unassigning user ${userId} from project ${projectId}:`, error);
            next(error);
        }
    }

    private transformAssignment(assignment: Assignment) {
        return {
            id: assignment.id,
            userId: assignment.userId,
            projectId: assignment.projectId,
            createdAt: assignment.createdAt,
            updatedAt: assignment.updatedAt,
        }
    }
}

export default new AssignmentController();
