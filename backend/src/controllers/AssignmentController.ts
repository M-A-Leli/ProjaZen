import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import AssignmentService from '../services/AssignmentService';
import Assignment from '../models/Assignment';

class AssignmentController {
    constructor() {
        this.fetchAllAssignments = this.fetchAllAssignments.bind(this);
        this.fetchAssignmentById = this.fetchAssignmentById.bind(this);
        this.createAssignment = this.createAssignment.bind(this);
        this.deleteAssignment = this.deleteAssignment.bind(this);
        this.getAssignmentsByUserId = this.getAssignmentsByUserId.bind(this);
        this.getAssignmentsForProject = this.getAssignmentsForProject.bind(this);
    }

    async fetchAllAssignments(req: Request, res: Response, next: NextFunction) {
        try {
            const assignments = await AssignmentService.getAllAssignments();
            res.json(assignments.map((assignment: Assignment) => this.transformAssignment(assignment)));
        } catch (error) {
            next(error);
        }
    }

    async fetchAssignmentById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const assignment = await AssignmentService.getAssignmentById(id);
            res.json(this.transformAssignment(assignment));
        } catch (error) {
            next(error);
        }
    }

    async createAssignment(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, projectId } = req.body;

        try {
            const newAssignment = await AssignmentService.createAssignment(userId, projectId);
            res.status(201).json(this.transformAssignment(newAssignment));
        } catch (error) {
            next(error);
        }
    }

    async deleteAssignment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletionStatus = await AssignmentService.deleteAssignment(id);

            if (deletionStatus) {
                res.status(204).send('Assignment deleted successfully.');
            }
        } catch (error) {
            next(error);
        }
    }

    async getAssignmentsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const assignments = await AssignmentService.getAssignmentsByUserId(userId);
            res.json(assignments.map((assignment: Assignment) => this.transformAssignment(assignment)));
        } catch (error) {
            next(error);
        }
    }

    async getAssignmentsForProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params;
            const assignments = await AssignmentService.getAssignmentsForProject(projectId);
            res.json(assignments.map((assignment: Assignment) => this.transformAssignment(assignment)));
        } catch (error) {
            next(error);
        }
    }

    private transformAssignment(assignment: Assignment) {
        return {
            id: assignment.getId(),
            userId: assignment.getUserId(),
            projectId: assignment.getProjectId()
        };
    }
}

export default new AssignmentController();
