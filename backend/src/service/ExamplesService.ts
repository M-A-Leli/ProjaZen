import createError from 'http-errors';
import { dbInstance } from '../database/dbInit';
import * as sql from 'mssql';
import Example from '../model/Example';
import { v4 as uuidv4 } from 'uuid';

class ExampleService {
    public async getAllExamples(): Promise<Example[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request().execute('GetAllExamples');

            if (result.recordset.length === 0) {
                throw createError(404, 'No Examples at the moment');
            }

            return result.recordset.map((record: any) => new Example(record.Id, record.Attr1, record.Attr2));
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

    public async getExampleById(exampleId: string): Promise<Example> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, exampleId)
                .execute('GetExampleById');

            if (!result.recordset[0]) {
                throw createError(404, 'Example not found');
            }

            const record = result.recordset[0];
            return new Example(record.Id, record.Attr1, record.Attr2);
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

    public async createExample(attr1: string, attr2: string): Promise<Example> {
        try {
            const id = uuidv4();
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .input('Attr1', sql.NVarChar(50), attr1)
                .input('Attr2', sql.NVarChar(50), attr2)
                .execute('CreateExample');

            const record = result.recordset[0];
            return new Example(record.Id, record.Attr1, record.Attr2);
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

    public async updateExample(example: Example): Promise<Example> {
        try {
            const pool = await dbInstance.connect();
            const existingExample = await pool.request()
                .input('Id', sql.UniqueIdentifier, example.id)
                .execute('GetExampleById');

            if (!existingExample.recordset[0]) {
                throw createError(404, 'Example not found');
            }

            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, example.id)
                .input('Attr1', sql.NVarChar(50), example.attr1)
                .input('Attr2', sql.NVarChar(50), example.attr2)
                .execute('UpdateExample');

            const record = result.recordset[0];
            return new Example(record.Id, record.Attr1, record.Attr2);
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

    public async deleteExample(id: string): Promise<boolean> {
        try {
            const pool = await dbInstance.connect();
            const existingExample = await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .execute('GetExampleById');

            if (!existingExample.recordset[0]) {
                throw createError(404, 'Example not found');
            }

            await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .execute('DeleteExample');

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
}

export default new ExampleService();
