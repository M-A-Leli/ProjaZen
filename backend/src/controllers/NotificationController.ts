import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import createError from 'http-errors';
import NotificationService from '../services/NotificationService';
import Notification from '../models/Notification';
import logger from '../utils/Logger';

class NotificationController {
    async createNotification(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newNotification = await NotificationService.createNotification(req.body);
            res.status(201).json(this.transformNotification(newNotification));
        } catch (error) {
            logger.error('Error creating notification:', error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    async getNotificationsByUserId(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;

        try {
            const notifications = await NotificationService.getNotificationsByUserId(userId);
            res.json(notifications.map(notification => this.transformNotification(notification)));
        } catch (error) {
            logger.error(`Error fetching notifications for user ${userId}:`, error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    async getUnreadNotifications(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;

        try {
            const unreadNotifications = await NotificationService.getUnreadNotifications(userId);
            const count = unreadNotifications.length;
            res.json({count, notifications: unreadNotifications.map((unreadNotification: Notification) => this.transformNotification(unreadNotification))});
        } catch (error) {
            logger.error(`Error fetching unread notifications for user ${userId}:`, error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    async markNotificationAsRead(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const notification = await NotificationService.markNotificationAsRead(id);
            res.json(this.transformNotification(notification));
        } catch (error) {
            logger.error(`Error marking notification ${id} as read:`, error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    async deleteNotification(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const result = await NotificationService.deleteNotification(id);
            res.status(204).json({ success: result });
        } catch (error) {
            logger.error(`Error deleting notification ${id}:`, error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    private transformNotification(notification: Notification) {
        return {
            id: notification.id,
            userId: notification.userId,
            message: notification.message,
            read: notification.read,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
        };
    }
}

export default new NotificationController();
