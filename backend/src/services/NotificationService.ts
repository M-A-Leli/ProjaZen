import Notification from '../models/Notification';
import createError from 'http-errors';

class NotificationService {
    async createNotification(notificationData: any) {
        try {
            const notification = await Notification.create(notificationData);
            return notification;
        } catch (error) {
            throw createError(500, `Error creating notification: ${error}`);
        }
    }

    async getNotificationsByUserId(userId: string) {
        try {
            const notifications = await Notification.findAll({ where: {userId}});
            return notifications;
        } catch (error) {
            throw createError(500, `Error fetching notifications for user: ${error}`);
        }
    }

    async getUnreadNotifications(userId: string) {
        try {
            const unreadNotifications = await Notification.findAll({ where: { userId, read: false } });
            return unreadNotifications;
        } catch (error) {
            throw createError(500, `Error fetching unread notifications for user: ${error}`);
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
            throw createError(500, `Error marking notification as read: ${error}`);
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
            throw createError(500, `Error deleting notification: ${error}`);
        }
    }
}

export default new NotificationService();
