import { Router } from 'express';
import ProjectController from '../controllers/ProjectController';
import { authenticateToken,authorizeAdmin, authorizeUser } from '../middleware/Authorization';

const router = Router();

router.get('/',authenticateToken,  authorizeAdmin, ProjectController.fetchAllProjects);
router.get('/:id',authenticateToken,  authorizeUser, ProjectController.fetchProjectById);
router.post('/',authenticateToken,  authorizeAdmin, ProjectController.createProject);
router.put('/:id',authenticateToken,  authorizeAdmin, ProjectController.updateProject);
router.delete('/:id',authenticateToken,  authorizeAdmin, ProjectController.deleteProject);
router.delete('/:status',authenticateToken,  authorizeAdmin, ProjectController.getProjectsByStatus);
router.delete('/:id/change-status',authenticateToken,  authorizeAdmin, ProjectController.changeProjectStatus);
router.put('/:id/mark-completed',authenticateToken,  authorizeUser, ProjectController.markProjectAsCompleted);

export default router;
