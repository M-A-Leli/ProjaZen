import createError from 'http-errors';
import { dbInstance } from '../database/dbInit';
import * as sql from 'mssql';
import Notification from '../models/Notification';
import { v4 as uuidv4 } from 'uuid';

class NotificationService {
    // public async getAllNotifications(): Promise<Notification[]> {
    //     try {
    //         const pool = await dbInstance.connect();
    //         const result = await pool.request().execute('GetAllNotifications');

    //         if (result.recordset.length === 0) {
    //             throw createError(404, 'No notifications at the moment');
    //         }

    //         return result.recordset.map((record: any) =>
    //             new Notification(
    //                 record.Id,
    //                 record.UserId,
    //                 record.message,
    //                 record.read,
    //                 record.createdAt,
    //                 record.updatedAt
    //             )
    //         );
    //     } catch (error) {
    //         if (error instanceof createError.HttpError) {
    //             throw error;
    //         } else if (error instanceof Error) {
    //             throw createError(500, `Unexpected error: ${error.message}`);
    //         } else {
    //             throw createError(500, 'Unexpected error occurred');
    //         }
    //     }
    // }

    public async getNotificationById(notificationId: string): Promise<Notification> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, notificationId)
                .execute('GetNotificationById');

            if (!result.recordset[0]) {
                throw createError(404, 'Notification not found');
            }

            const record = result.recordset[0];
            return new Notification(
                record.id,
                record.userId,
                record.message,
                record.read,
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

    public async createNotification(userId: string, message: string): Promise<Notification> {
        try {
            const id = uuidv4();
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, id)
                .input('UserId', sql.UniqueIdentifier, userId)
                .input('Message', sql.NVarChar(255), message)
                .execute('CreateNotification');

            const record = result.recordset[0];
            return new Notification(
                record.id,
                record.userId,
                record.message,
                record.read,
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

    public async deleteNotification(notificationId: string): Promise<boolean> {
        try {
            const pool = await dbInstance.connect();
            const existingNotification = await pool.request()
                .input('Id', sql.UniqueIdentifier, notificationId)
                .execute('GetNotificationById');

            if (!existingNotification.recordset[0]) {
                throw createError(404, 'Notification not found');
            }

            await pool.request()
                .input('Id', sql.UniqueIdentifier, notificationId)
                .execute('DeleteNotification');

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

    public async getNotificationsByUserId(userId: string): Promise<Notification[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('UserId', sql.UniqueIdentifier, userId)
                .execute('GetNotificationsForUser');

            if (result.recordset.length === 0) {
                throw createError(404, `No notifications for user with ID ${userId} at the moment`);
            }

            return result.recordset.map((record: any) =>
                new Notification(
                    record.id,
                    record.userId,
                    record.message,
                    record.read,
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

    public async getUnreadNotificationsByUserId(userId: string): Promise<Notification[]> {
        try {
            const pool = await dbInstance.connect();
            const result = await pool.request()
                .input('UserId', sql.UniqueIdentifier, userId)
                .execute('GetUnreadNotificationsForUser');

            if (result.recordset.length === 0) {
                throw createError(404, `No unread notifications for user with ID ${userId} at the moment`);
            }

            return result.recordset.map((record: any) =>
                new Notification(
                    record.id,
                    record.userId,
                    record.message,
                    record.read,
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

    public async markNotificationAsRead(notificationId: string): Promise<Notification> {
        try {
            const pool = await dbInstance.connect();
            const existingNotification = await pool.request()
                .input('Id', sql.UniqueIdentifier, notificationId)
                .execute('GetNotificationById');

            if (!existingNotification.recordset[0]) {
                throw createError(404, 'Notification not found');
            }

            const result = await pool.request()
                .input('Id', sql.UniqueIdentifier, notificationId)
                .execute('MarkNotificationAsRead');

            const record = result.recordset[0];
            return new Notification(
                record.id,
                record.userId,
                record.message,
                record.read,
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
}

export default new NotificationService();
