import { Router } from 'express';
import AssignmentController from '../controllers/AssignmentController';
import { authenticateToken, authorizeAdmin, authorizeUser } from '../middleware/Authorization';

const router = Router();

router.get('/', authenticateToken, authorizeAdmin, AssignmentController.fetchAllAssignments);
router.get('/:id', authenticateToken, authorizeUser, AssignmentController.fetchAssignmentById);
router.post('/', authenticateToken, authorizeAdmin, AssignmentController.createAssignment);
router.delete('/:id', authenticateToken, authorizeAdmin, AssignmentController.deleteAssignment);
router.get('/user/:id', authenticateToken, authorizeUser, AssignmentController.getAssignmentsByUserId);
router.get('/project/:id', authenticateToken, authorizeAdmin, AssignmentController.getAssignmentsForProject);

export default router;
