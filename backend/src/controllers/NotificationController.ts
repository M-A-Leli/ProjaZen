import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import NotificationService from '../services/NotificationService';
import Notification from '../models/Notification';

class NotificationController {
    constructor() {
        this.fetchNotificationById = this.fetchNotificationById.bind(this);
        this.fetchNotificationsByUserId = this.fetchNotificationsByUserId.bind(this);
        this.fetchUnreadNotificationsByUserId = this.fetchUnreadNotificationsByUserId.bind(this);
        this.markNotificationAsRead = this.markNotificationAsRead.bind(this);
        this.createNotification = this.createNotification.bind(this);
        this.deleteNotification = this.deleteNotification.bind(this);
    }

    async fetchNotificationById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const notification = await NotificationService.getNotificationById(id);
            res.json(this.transformNotification(notification));
        } catch (error) {
            next(error);
        }
    }

    async fetchNotificationsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const notifications = await NotificationService.getNotificationsByUserId(userId);
            res.json(notifications.map((notification: Notification) => this.transformNotification(notification)));
        } catch (error) {
            next(error);
        }
    }

    async fetchUnreadNotificationsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const unreadNotifications = await NotificationService.getUnreadNotificationsByUserId(userId);
            res.json(unreadNotifications.map((notification: Notification) => this.transformNotification(notification)));
        } catch (error) {
            next(error);
        }
    }

    async markNotificationAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await NotificationService.markNotificationAsRead(id);
            res.status(200).send('Notification marked as read.');
        } catch (error) {
            next(error);
        }
    }

    async createNotification(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, message } = req.body;

        try {
            const newNotification = await NotificationService.createNotification(userId, message);
            res.status(201).json(this.transformNotification(newNotification));
        } catch (error) {
            next(error);
        }
    }

    async deleteNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletionStatus = await NotificationService.deleteNotification(id);

            if (deletionStatus) {
                res.status(204).send('Notification deleted successfully.');
            }
        } catch (error) {
            next(error);
        }
    }

    private transformNotification(notification: Notification) {
        return {
            id: notification.getId(),
            userId: notification.getUserId(),
            message: notification.getMessage(),
            read: notification.isRead()
        };
    }
}

export default new NotificationController();
