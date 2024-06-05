import { Router } from 'express';
import AssignmentController from '../controllers/AssignmentController';
import { authenticateToken, authorizeAdmin } from '../middleware/Authorization';

const router = Router();

router.post('/assign', authenticateToken, authorizeAdmin, AssignmentController.assignUserToProject);
router.post('/unassign', authenticateToken, authorizeAdmin, AssignmentController.unassignUserFromProject);

export default router;
