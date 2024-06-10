import express from 'express';
import assignmentRoutes from './AssignmentRoutes';
import authRoutes from './AuthRoutes';
import notificationRoutes from './NotificationRoutes';
import projectRoutes from './ProjectRoutes';
import userRoutes from './UserRoutes';

const router = express.Router();

// Mount routes
router.use('/assignments', assignmentRoutes);
router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes);
router.use('/projects', projectRoutes);
router.use('/users', userRoutes);

export default router;
