import Notification from '../models/Notification';
import createError from 'http-errors';

class NotificationService {
    async createNotification(notificationData: any) {
        try {
            const notification = await Notification.create(notificationData);
            return notification;
        } catch (error) {
            throw createError(500, 'Error creating notification');
        }
    }

    async getNotificationsByUserId(userId: string) {
        try {
            const notifications = await Notification.findAll({ where: {userId}});
            return notifications;
        } catch (error) {
            throw createError(500, `Error fetching notifications for user ${userId}`);
        }
    }

    async getUnreadNotifications(userId: string) {
        try {
            const unreadNotifications = await Notification.findAll({ where: { userId, read: false } });
            return unreadNotifications;
        } catch (error) {
            throw createError(500, `Error fetching unread notifications for user ${userId}`);
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
            throw createError(500, `Error marking notification ${id} as read`);
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
            throw createError(500, `Error deleting notification ${id}`);
        }
    }
}

export default new NotificationService();
