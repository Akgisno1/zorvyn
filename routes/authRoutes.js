import express from 'express';
import { login, logout } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema } from '../utils/schemas.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);

export default router;
