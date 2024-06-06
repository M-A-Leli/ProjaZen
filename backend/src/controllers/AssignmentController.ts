import { Request, Response, NextFunction } from 'express';
import AssignmentService from '../services/AssignmentService';
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
            next(error);
        }
    }

    async unassignUserFromProject(req: Request, res: Response, next: NextFunction) {
        const { projectId, userId } = req.body;

        try {
            const result = await AssignmentService.unassignUserFromProject(projectId, userId);
            res.status(200).json({ success: result });
        } catch (error) {
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
