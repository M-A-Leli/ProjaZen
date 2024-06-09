import createError from 'http-errors';
import { dbInstance } from '../database/dbInit';
import * as sql from 'mssql';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

class UserService {
    public async getAllUsers(): Promise<User[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request().execute('GetAllUsers');

            if (result.recordset.length === 0) {
                throw createError(404, 'No users at the moment');
            }

            return result.recordset.map((record: any) =>
                new User(
                    record.Id,
                    record.fname,
                    record.lname,
                    record.email,
                    record.password,
                    record.salt,
                    record.role,
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

    public async getUserById(userId: string): Promise<User> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, userId)
                .execute('GetUserById');

            if (!result.recordset[0]) {
                throw createError(404, 'User not found');
            }

            const record = result.recordset[0];
            return new User(
                record.Id,
                record.fname,
                record.lname,
                record.email,
                record.password,
                record.salt,
                record.role,
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

    public async createUser(
        fname: string,
        lname: string,
        email: string,
        password: string,
        salt: string,
        role: string = 'user'
    ): Promise<User> {
        try {
            const id = uuidv4();
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .input('fname', sql.NVarChar(50), fname)
                .input('lname', sql.NVarChar(50), lname)
                .input('email', sql.NVarChar(255), email)
                .input('password', sql.NVarChar(255), password)
                .input('salt', sql.NVarChar(255), salt)
                .input('role', sql.NVarChar(50), role)
                .execute('CreateUser');

            const record = result.recordset[0];
            return new User(
                record.Id,
                record.fname,
                record.lname,
                record.email,
                record.password,
                record.salt,
                record.role,
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

    public async updateUser(user: User): Promise<User> {
        try {
            const pool = await dbInstance.connect();
            const existingUser = await pool.request()
                .input('Id', sql.UniqueIdentifier, user.getId())
                .execute('GetUserById');

            if (!existingUser.recordset[0]) {
                throw createError(404, 'User not found');
            }

            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, user.getId())
                .input('fname', sql.NVarChar(50), user.getFname())
                .input('lname', sql.NVarChar(50), user.getLname())
                .input('email', sql.NVarChar(255), user.getEmail())
                .input('password', sql.NVarChar(255), user.getPassword())
                .input('salt', sql.NVarChar(255), user.getSalt())
                .input('role', sql.NVarChar(50), user.getRole())
                .execute('UpdateUser');

            const record = result.recordset[0];
            return new User(
                record.Id,
                record.fname,
                record.lname,
                record.email,
                record.password,
                record.salt,
                record.role,
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

    public async deleteUser(id: string): Promise<boolean> {
        try {
            const pool = await dbInstance.connect();
            const existingUser = await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .execute('GetUserById');

            if (!existingUser.recordset[0]) {
                throw createError(404, 'User not found');
            }

            await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .execute('DeleteUser');

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

    public async getUserByEmail(email: string): Promise<User> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Email', sql.NVarChar(255), email)
                .execute('GetUserByEmail');

            if (!result.recordset[0]) {
                throw createError(404, 'User not found');
            }

            const record = result.recordset[0];
            return new User(
                record.Id,
                record.fname,
                record.lname,
                record.email,
                record.password,
                record.salt,
                record.role,
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

    public async getUnassignedUsers(): Promise<User[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request().execute('GetUnassignedUsers');

            if (result.recordset.length === 0) {
                throw createError(404, 'No unassigned users at the moment');
            }

            return result.recordset.map((record: any) =>
                new User(
                    record.Id,
                    record.fname,
                    record.lname,
                    record.email,
                    record.password,
                    record.salt,
                    record.role,
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

    public async getAssignedUsers(): Promise<User[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request().execute('GetAssignedUsers');

            if (result.recordset.length === 0) {
                throw createError(404, 'No assigned users at the moment');
            }

            return result.recordset.map((record: any) =>
                new User(
                    record.Id,
                    record.fname,
                    record.lname,
                    record.email,
                    record.password,
                    record.salt,
                    record.role,
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

export default new UserService();
