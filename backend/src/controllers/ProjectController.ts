import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ProjectService from '../services/ProjectService';
import Project from '../models/Project';

class ProjectController {
    constructor() {
        this.fetchAllProjects = this.fetchAllProjects.bind(this);
        this.fetchProjectById = this.fetchProjectById.bind(this);
        this.createProject = this.createProject.bind(this);
        this.updateProject = this.updateProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.getProjectsByStatus = this.getProjectsByStatus.bind(this);
        this.getProjectByName = this.getProjectByName.bind(this);
        this.markProjectAsCompleted = this.markProjectAsCompleted.bind(this);
    }

    async fetchAllProjects(req: Request, res: Response, next: NextFunction) {
        try {
            const projects = await ProjectService.getAllProjects();
            res.json(projects.map((project: Project) => this.transformProject(project)));
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

        const { name, description, startDate, endDate, status } = req.body;

        try {
            const newProject = await ProjectService.createProject(name, description, startDate, endDate, status);
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

        // const updatedProjectData = {
        //     id: id,
        //     name: req.body.name,
        //     description: req.body.description,
        //     startDate: req.body.startDate,
        //     endDate: req.body.endDate,
        //     status: req.body.status
        // };

        const project = new Project(id, req.body.name, req.body.description, req.body.startDate, req.body.endDate, req.body.status);

        try {
            const updatedProject = await ProjectService.updateProject(project);
            res.json(this.transformProject(updatedProject));
        } catch (error) {
            next(error);
        }
    }

    async deleteProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletionStatus = await ProjectService.deleteProject(id);

            if (deletionStatus) {
                res.status(204).send('Project deleted successfully.');
            }
        } catch (error) {
            next(error);
        }
    }

    async getProjectsByStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { status } = req.params;
            const projects = await ProjectService.getProjectsByStatus(status);
            res.json(projects.map((project: Project) => this.transformProject(project)));
        } catch (error) {
            next(error);
        }
    }

    async getProjectByName(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.params;
            const project = await ProjectService.getProjectByName(name);
            res.json(this.transformProject(project));
        } catch (error) {
            next(error);
        }
    }

    async markProjectAsCompleted(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await ProjectService.markProjectAsCompleted(id);
            res.status(200).send('Project marked as completed.');
        } catch (error) {
            next(error);
        }
    }

    private transformProject(project: Project) {
        return {
            id: project.getId(),
            name: project.getName(),
            description: project.getDescription(),
            startDate: project.getStartDate(),
            endDate: project.getEndDate(),
            status: project.getStatus()
        };
    }
}

export default new ProjectController();
