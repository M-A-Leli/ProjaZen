import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import AssignmentService from '../services/AssignmentService';
import logger from '../utils/Logger';
import { Assignment } from '../models';

class AssignmentController {
    async assignUserToProject(req: Request, res: Response, next: NextFunction) {
        const { projectId, userId } = req.body;

        try {
            const assignment = await AssignmentService.assignUserToProject(projectId, userId);
            res.status(201).json(this.transformAssignment(assignment));
        } catch (error) {
            logger.error(`Error assigning user ${userId} to project ${projectId}:`, error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    async unassignUserFromProject(req: Request, res: Response, next: NextFunction) {
        const { projectId, userId } = req.body;

        try {
            const result = await AssignmentService.unassignUserFromProject(projectId, userId);
            res.status(200).json({ success: result });
        } catch (error) {
            logger.error(`Error unassigning user ${userId} from project ${projectId}:`, error);
            next(createError(500, 'Internal Server Error'));
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
