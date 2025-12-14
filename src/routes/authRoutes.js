import { Router } from 'express';
import { login, logout, refresh } from '../controllers/authController.js';
import { jwtAuth } from '../middleware/jwtAuth.js';

const router = Router();

router.post('/login', login);
router.post('/logout', jwtAuth, logout);
router.post('/refresh', jwtAuth, refresh);

export default router;
