import createError from 'http-errors';
import { dbInstance } from '../database/dbInit';
import * as sql from 'mssql';
import Assignment from '../models/Assignment';
import { v4 as uuidv4 } from 'uuid';

class AssignmentService {
    public async getAllAssignments(): Promise<Assignment[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request().execute('GetAllAssignments');

            if (result.recordset.length === 0) {
                throw createError(404, 'No assignments at the moment');
            }

            return result.recordset.map((record: any) =>
                new Assignment(
                    record.Id,
                    record.UserId,
                    record.ProjectId,
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

    public async getAssignmentById(assignmentId: string): Promise<Assignment> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, assignmentId)
                .execute('GetAssignmentById');

            if (!result.recordset[0]) {
                throw createError(404, 'Assignment not found');
            }

            const record = result.recordset[0];
            return new Assignment(
                record.Id,
                record.UserId,
                record.ProjectId,
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

    public async createAssignment(userId: string, projectId: string): Promise<Assignment> {
        try {
            const id = uuidv4();
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .input('UserId', sql.UniqueIdentifier, userId)
                .input('ProjectId', sql.UniqueIdentifier, projectId)
                .execute('CreateAssignment');

            const record = result.recordset[0];
            return new Assignment(
                record.Id,
                record.UserId,
                record.ProjectId,
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

    public async deleteAssignment(assignmentId: string): Promise<boolean> {
        try {
            const pool = await dbInstance.connect();
            const existingAssignment = await pool.request()
                .input('Id', sql.UniqueIdentifier, assignmentId)
                .execute('GetAssignmentById');

            if (!existingAssignment.recordset[0]) {
                throw createError(404, 'Assignment not found');
            }

            await pool.request()
                .input('Id', sql.UniqueIdentifier, assignmentId)
                .execute('DeleteAssignment');

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

    public async getAssignmentsByUserId(userId: string): Promise<Assignment[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('UserId', sql.UniqueIdentifier, userId)
                .execute('GetAssignmentsForUser');

            if (result.recordset.length === 0) {
                throw createError(404, `No assignments for user with ID ${userId} at the moment`);
            }

            return result.recordset.map((record: any) =>
                new Assignment(
                    record.Id,
                    record.UserId,
                    record.ProjectId,
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

    public async getAssignmentsForProject(projectId: string): Promise<Assignment[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('ProjectId', sql.UniqueIdentifier, projectId)
                .execute('GetAssignmentsForProject');

            if (result.recordset.length === 0) {
                throw createError(404, `No assignments found for project with ID ${projectId}`);
            }

            return result.recordset.map((record: any) =>
                new Assignment(
                    record.Id,
                    record.UserId,
                    record.ProjectId,
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
}

export default new AssignmentService();
