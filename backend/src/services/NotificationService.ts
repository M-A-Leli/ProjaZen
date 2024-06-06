import Notification from '../models/Notification';
import createError from 'http-errors';

class NotificationService {
    async createNotification(notificationData: any) {
        try {
            const notification = await Notification.create(notificationData);
            return notification;
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

    async getNotificationsByUserId(userId: string) {
        try {
            const notifications = await Notification.findAll({ where: {userId}});
            return notifications;
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

    async getUnreadNotifications(userId: string) {
        try {
            const unreadNotifications = await Notification.findAll({ where: { userId, read: false } });
            return unreadNotifications;
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

    async markNotificationAsRead(id: string) {
        try {
            const notification = await Notification.findByPk(id);
            if (!notification) {
                throw createError(404, 'Notification not found');
            }
            notification.read = true;
            await notification.save();
            return notification;
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

    async deleteNotification(id: string) {
        try {
            const notification = await Notification.findByPk(id);
            if (!notification) {
                throw createError(404, 'Notification not found');
            }
            await notification.destroy();
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

export default new NotificationService();
