import express from 'express';
import { createUser, updateUserStatus } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, userStatusSchema } from '../utils/schemas.js';

const router = express.Router();

router.post('/createUser', validate(registerSchema), createUser);
router.patch('/:id/status', authenticate, authorize(['ADMIN']), validate(userStatusSchema), updateUserStatus);

export default router;
