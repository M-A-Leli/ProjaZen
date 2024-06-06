import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ProjectService from '../services/ProjectService';
import { Project } from '../models';

class ProjectController {
    constructor() {
        this.fetchAllProjects = this.fetchAllProjects.bind(this);
        this.fetchProjectById = this.fetchProjectById.bind(this);
        this.createProject = this.createProject.bind(this);
        this.updateProject = this.updateProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.getProjectsByStatus = this.getProjectsByStatus.bind(this);
        this.changeProjectStatus = this.changeProjectStatus.bind(this);
        this.markProjectAsCompleted = this.markProjectAsCompleted.bind(this);
    }

    async fetchAllProjects(req: Request, res: Response, next: NextFunction) {
        try {
            const projects = await ProjectService.getAllProjects();
            res.json(projects.map(project => this.transformProject(project)));
        } catch (error) {
            next(error);
        }
    }

    async fetchProjectById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const project = await ProjectService.getProjectById(id);
            res.json(this.transformProject(project));
        } catch (error) {
            next(error);
        }
    }

    async createProject(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newProject = await ProjectService.createProject(req.body);
            res.status(201).json(this.transformProject(newProject));
        } catch (error) {
            next(error);
        }
    }

    async updateProject(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedProject = await ProjectService.updateProject(id, req.body);
            res.json(this.transformProject(updatedProject));
        } catch (error) {
            next(error);
        }
    }

    async deleteProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletedProject = await ProjectService.deleteProject(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getProjectsByStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { status } = req.params;
            const projects = await ProjectService.getProjectsByStatus(status);
            res.json(projects.map(project => this.transformProject(project)));
        } catch (error) {
            next(error);
        }
    }

    async changeProjectStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedProject = await ProjectService.changeProjectStatus(id, status);
            res.json(this.transformProject(updatedProject));
        } catch (error) {
            next(error);
        }
    }

    async markProjectAsCompleted(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
    
        try {
            const completedProject = await ProjectService.markProjectAsCompleted(id);
            res.json(this.transformProject(completedProject));
        } catch (error) {
            next(error);
        }
    }

    private transformProject(project: Project) {
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
            status: project.status,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };
    }
}

export default new ProjectController();
