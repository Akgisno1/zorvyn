import express from 'express';
import { createRecord, getRecords, getRecordsByUser, updateRecord, deleteRecord } from '../controllers/recordController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validate } from '../middlewares/validate.js';
import { recordSchema } from '../utils/schemas.js';

const router = express.Router();

router.post('/', authenticate, validate(recordSchema), createRecord);
router.get('/', authenticate, authorize(['ADMIN', 'ANALYST', 'VIEWER']), getRecords);
router.get('/user/:userId', authenticate, authorize(['ADMIN']), getRecordsByUser);
router.put('/:id', authenticate, validate(recordSchema), updateRecord);
router.delete('/:id', authenticate, deleteRecord);

export default router;
