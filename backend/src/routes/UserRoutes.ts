import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authenticateToken, authorizeAdmin,authorizeUser } from '../middleware/Authorization';

const router = Router();

router.get('/', authenticateToken, authorizeAdmin, UserController.fetchAllUsers);
router.get('/:id', authenticateToken, authorizeAdmin, UserController.fetchUserById);
router.post('/', UserController.createUser);
router.put('/:id', authenticateToken, authorizeAdmin, UserController.updateUser);
router.delete('/:id', authenticateToken, authorizeAdmin, UserController.deleteUser);
router.get('/profile', authenticateToken, authorizeUser, UserController.getUserProfile);
router.put('/profile', authenticateToken, authorizeUser, UserController.updateUserProfile);

export default router;
