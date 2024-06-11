import createError from 'http-errors';
import { dbInstance } from '../database/dbInit';
import * as sql from 'mssql';
import Project from '../models/Project';
import { sendProjectCompletedEmail } from './EmailService';
import { v4 as uuidv4 } from 'uuid';

class ProjectService {
    public async getAllProjects(): Promise<Project[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request().execute('GetAllProjects');

            if (result.recordset.length === 0) {
                throw createError(404, 'No projects at the moment');
            }

            return result.recordset.map((record: any) =>
                new Project(
                    record.id,
                    record.name,
                    record.description,
                    record.startDate,
                    record.endDate,
                    record.status,
                    record.createdAt,
                    record.updatedAt
                )
            );
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

    public async getProjectById(projectId: string): Promise<Project> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, projectId)
                .execute('GetProjectById');

            if (!result.recordset[0]) {
                throw createError(404, 'Project not found');
            }

            const record = result.recordset[0];
            return new Project(
                record.id,
                record.name,
                record.description,
                record.startDate,
                record.endDate,
                record.status,
                record.createdAt,
                record.updatedAt
            );
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

    public async createProject(
        name: string,
        description: string,
        startDate: Date,
        endDate: Date,
        status: string = 'unassigned'
    ): Promise<Project> {
        try {
            const id = uuidv4();
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .input('Name', sql.NVarChar(255), name)
                .input('Description', sql.NVarChar(255), description)
                .input('StartDate', sql.DateTime, startDate)
                .input('EndDate', sql.DateTime, endDate)
                .input('Status', sql.NVarChar(50), status)
                .execute('CreateProject');

            const record = result.recordset[0];

            console.log(record);
            
            return new Project(
                record.id,
                record.name,
                record.description,
                record.startDate,
                record.endDate,
                record.status,
                record.createdAt,
                record.updatedAt
            );
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

    public async updateProject(project: Project): Promise<Project> {
        try {
            const pool = await dbInstance.connect();
            const existingProject = await pool.request()
                .input('Id', sql.UniqueIdentifier, project.getId())
                .execute('GetProjectById');

            if (!existingProject.recordset[0]) {
                throw createError(404, 'Project not found');
            }

            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, project.getId())
                .input('Name', sql.NVarChar(255), project.getName())
                .input('Description', sql.NVarChar(255), project.getDescription())
                .input('StartDate', sql.DateTime, project.getStartDate())
                .input('EndDate', sql.DateTime, project.getEndDate())
                .input('Status', sql.NVarChar(50), project.getStatus())
                .execute('UpdateProject');

            const record = result.recordset[0];
            return new Project(
                record.id,
                record.name,
                record.description,
                record.startDate,
                record.endDate,
                record.status,
                record.createdAt,
                record.updatedAt
            );
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

    public async deleteProject(id: string): Promise<boolean> {
        try {
            const pool = await dbInstance.connect();
            const existingProject = await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .execute('GetProjectById');

            if (!existingProject.recordset[0]) {
                throw createError(404, 'Project not found');
            }

            await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .execute('DeleteProject');

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

    public async getProjectsByStatus(status: string): Promise<Project[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Status', sql.NVarChar(50), status)
                .execute('GetProjectsByStatus');

            if (result.recordset.length === 0) {
                throw createError(404, `No projects with status ${status} at the moment`);
            }

            return result.recordset.map((record: any) =>
                new Project(
                    record.id,
                    record.name,
                    record.description,
                    record.startDate,
                    record.endDate,
                    record.status,
                    record.createdAt,
                    record.updatedAt
                )
            );
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

    public async getProjectByName(name: string): Promise<Project> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Name', sql.NVarChar(255), name)
                .execute('GetProjectByName');

            if (!result.recordset[0]) {
                throw createError(404, 'Project not found');
            }

            const record = result.recordset[0];
            return new Project(
                record.id,
                record.name,
                record.description,
                record.startDate,
                record.endDate,
                record.status,
                record.createdAt,
                record.updatedAt
            );
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

    public async markProjectAsCompleted(id: string): Promise<Project> {
        try {
            const pool = await dbInstance.connect();
            const existingProject = await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .execute('GetProjectById');
    
            if (!existingProject.recordset[0]) {
                throw createError(404, 'Project not found');
            }
    
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .execute('MarkProjectAsCompleted');
    
            const record = result.recordset[0];
            const project = new Project(
                record.id,
                record.name,
                record.description,
                record.startDate,
                record.endDate,
                record.status,
                record.createdAt,
                record.updatedAt
            );
    
            const assignmentsResult = await pool.request()
                .input('ProjectId', sql.UniqueIdentifier, id)
                .execute('GetAssignmentsByProjectId');
    
            for (const assignment of assignmentsResult.recordset) {
                const userResult = await pool.request()
                    .input('UserId', sql.UniqueIdentifier, assignment.UserId)
                    .execute('GetUserById');
    
                const user = userResult.recordset[0];
    
                await sendProjectCompletedEmail(user.email, {
                    fname: user.fname,
                    lname: user.lname,
                    projectName: project.getName(),
                });
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

    public async handleEndDates(): Promise<void> {
        try {
            const now = new Date();
            const projects = await this.getProjectsByEndDate(now);

            for (const project of projects) {
                if (project.getStatus() === 'unassigned') {
                    project.setStatus('expired');
                } else if (project.getStatus() === 'assigned') {
                    project.setStatus('overdue');
                }
                await this.updateProjectStatus(project);
            }
            // !
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

    private async getProjectsByEndDate(endDate: Date): Promise<Project[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('EndDate', sql.DateTime, endDate)
                .execute('GetProjectsByEndDate');

            return result.recordset.map((record: any) =>
                new Project(
                    record.id,
                    record.name,
                    record.description,
                    record.startDate,
                    record.endDate,
                    record.status
                )
            );
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

    private async updateProjectStatus(project: Project): Promise<void> {
        try {
            const pool = await dbInstance.connect();
            await pool.request()
                .input('Id', sql.UniqueIdentifier, project.getId())
                .input('Status', sql.NVarChar(50), project.getStatus())
                .execute('UpdateProjectStatus');
            // !
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
