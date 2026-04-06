import express from 'express';
import { 
    getTotalIncome, 
    getTotalExpense, 
    getMyTotalIncome, 
    getMyTotalExpense, 
    getNetBalance, 
    getMyNetBalance, 
    getCategorySummary, 
    getMyCategorySummary, 
    getRecentActivity, 
    getMyRecentActivity, 
    getTrends,
    getMyTrends 
} from '../controllers/summaryController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

// Public Summaries (Accessible by ADMIN and ANALYST)
router.get('/total-income', authenticate, authorize(['ADMIN', 'ANALYST']), getTotalIncome);
router.get('/total-expense', authenticate, authorize(['ADMIN', 'ANALYST']), getTotalExpense);
router.get('/net-balance', authenticate, authorize(['ADMIN', 'ANALYST']), getNetBalance);
router.get('/category', authenticate, authorize(['ADMIN', 'ANALYST']), getCategorySummary);
router.get('/recent', authenticate, authorize(['ADMIN', 'ANALYST']), getRecentActivity);
router.get('/trends', authenticate, authorize(['ADMIN', 'ANALYST']), getTrends);

// Personal Summaries (Accessible by ADMIN only)
router.get('/my-total-income', authenticate, authorize(['ADMIN']), getMyTotalIncome);
router.get('/my-total-expense', authenticate, authorize(['ADMIN']), getMyTotalExpense);
router.get('/my-net-balance', authenticate, authorize(['ADMIN']), getMyNetBalance);
router.get('/my-category', authenticate, authorize(['ADMIN']), getMyCategorySummary);
router.get('/my-recent', authenticate, authorize(['ADMIN']), getMyRecentActivity);
router.get('/my-trends', authenticate, authorize(['ADMIN']), getMyTrends);

export default router;
