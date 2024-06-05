import { Router } from 'express';
import { authenticateToken } from '../middleware/Authorization';
import AuthController from '../controllers/AuthController';
import { validateLoginInput } from '../middleware/InputValidation';

const router = Router();

router.post('/login', validateLoginInput, AuthController.login);

router.post('/logout', authenticateToken, AuthController.logout); //!

export default router;
