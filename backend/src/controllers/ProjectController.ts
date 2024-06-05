import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import createError from 'http-errors';
import ProjectService from '../services/ProjectService';
import logger from '../utils/Logger';
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
            logger.error('Error fetching all projects:', error);
            next(error);
        }
    }

    async fetchProjectById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const project = await ProjectService.getProjectById(id);
            if (!project) {
                return next(createError(404, 'Project not found'));
            }
            res.json(this.transformProject(project));
        } catch (error) {
            logger.error(`Error fetching project by ID ${req.params.id}:`, error);
            next(error);
        }
    }

    async createProject(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const existingProject = await ProjectService.getProjectsByName(req.body.name);
            if (existingProject) {
                return next(createError(409, 'Project already exists'));
            }

            const newProject = await ProjectService.createProject(req.body);
            res.status(201).json(this.transformProject(newProject));
        } catch (error) {
            logger.error('Error creating project:', error);
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
            if (!updatedProject) {
                return next(createError(404, 'Project not found'));
            }
            res.json(this.transformProject(updatedProject));
        } catch (error) {
            logger.error(`Error updating project by ID ${req.params.id}:`, error);
            next(error);
        }
    }

    async deleteProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletedProject = await ProjectService.deleteProject(id);
            if (!deletedProject) {
                return next(createError(404, 'Project not found'));
            }
            res.status(204).send();
        } catch (error) {
            logger.error(`Error deleting project by ID ${req.params.id}:`, error);
            next(error);
        }
    }

    async getProjectsByStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { status } = req.params;
            const projects = await ProjectService.getProjectsByStatus(status);
            res.json(projects.map(project => this.transformProject(project)));
        } catch (error) {
            logger.error(`Error fetching ${req.params.status} projects:`, error);
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
            logger.error(`Error changing project status for ${req.params.id}:`, error);
            next(error);
        }
    }

    async markProjectAsCompleted(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
    
        try {
            const completedProject = await ProjectService.markProjectAsCompleted(id);
            res.json(this.transformProject(completedProject));
        } catch (error) {
            logger.error(`Error marking project ${id} as completed:`, error);
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
