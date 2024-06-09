import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import { authenticateToken, authorizeAdmin, authorizeUser } from '../middleware/Authorization';

const router = Router();

router.get('/:id',authenticateToken, authorizeUser, NotificationController.fetchNotificationById);
router.post('/',authenticateToken, authorizeAdmin, NotificationController.createNotification);
router.get('/user/:id',authenticateToken, authorizeUser, NotificationController.fetchNotificationsByUserId);
router.get('/unread/user/:id',authenticateToken, authorizeUser, NotificationController.fetchUnreadNotificationsByUserId);
router.patch('/:id/read',authenticateToken, authorizeUser, NotificationController.markNotificationAsRead);
router.delete('/:id',authenticateToken, authorizeUser, NotificationController.deleteNotification);

export default router;
