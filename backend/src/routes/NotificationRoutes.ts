import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import { authenticateToken, authorizeAdmin, authorizeUser } from '../middleware/Authorization';

const router = Router();

router.post('/',authenticateToken, authorizeAdmin, NotificationController.createNotification);
router.get('/:userId',authenticateToken, authorizeUser, NotificationController.getNotificationsByUserId);
router.get('/unread/:userId',authenticateToken, authorizeUser, NotificationController.getUnreadNotifications);
router.patch('/:id/read',authenticateToken, authorizeUser, NotificationController.markNotificationAsRead);
router.delete('/:id',authenticateToken, authorizeUser, NotificationController.deleteNotification);

export default router;
