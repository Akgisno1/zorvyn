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

/**
 * @swagger
 * tags:
 *   name: Summary
 *   description: Dashboard summary and analytics
 */

/**
 * @swagger
 * /summary/total-income:
 *   get:
 *     summary: Get total income (Admin/Analyst only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total income fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/total-income', authenticate, authorize(['ADMIN', 'ANALYST']), getTotalIncome);

/**
 * @swagger
 * /summary/total-expense:
 *   get:
 *     summary: Get total expense (Admin/Analyst only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total expense fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/total-expense', authenticate, authorize(['ADMIN', 'ANALYST']), getTotalExpense);

/**
 * @swagger
 * /summary/net-balance:
 *   get:
 *     summary: Get net balance (Admin/Analyst only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Net balance fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/net-balance', authenticate, authorize(['ADMIN', 'ANALYST']), getNetBalance);

/**
 * @swagger
 * /summary/category:
 *   get:
 *     summary: Get category-wise totals (Admin/Analyst only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/category', authenticate, authorize(['ADMIN', 'ANALYST']), getCategorySummary);

/**
 * @swagger
 * /summary/recent:
 *   get:
 *     summary: Get recent activity (Admin/Analyst only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/recent', authenticate, authorize(['ADMIN', 'ANALYST']), getRecentActivity);

/**
 * @swagger
 * /summary/trends:
 *   get:
 *     summary: Get monthly/weekly trends (Admin/Analyst only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trends fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/trends', authenticate, authorize(['ADMIN', 'ANALYST']), getTrends);

/**
 * @swagger
 * /summary/my-total-income:
 *   get:
 *     summary: Get user's own total income (Admin only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personal total income fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/my-total-income', authenticate, authorize(['ADMIN']), getMyTotalIncome);

/**
 * @swagger
 * /summary/my-total-expense:
 *   get:
 *     summary: Get user's own total expense (Admin only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personal total expense fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/my-total-expense', authenticate, authorize(['ADMIN']), getMyTotalExpense);

/**
 * @swagger
 * /summary/my-net-balance:
 *   get:
 *     summary: Get user's own net balance (Admin only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personal net balance fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/my-net-balance', authenticate, authorize(['ADMIN']), getMyNetBalance);

/**
 * @swagger
 * /summary/my-category:
 *   get:
 *     summary: Get user's own category-wise totals (Admin only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personal category summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/my-category', authenticate, authorize(['ADMIN']), getMyCategorySummary);

/**
 * @swagger
 * /summary/my-recent:
 *   get:
 *     summary: Get user's own recent activity (Admin only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personal recent activity fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/my-recent', authenticate, authorize(['ADMIN']), getMyRecentActivity);

/**
 * @swagger
 * /summary/my-trends:
 *   get:
 *     summary: Get user's own monthly/weekly trends (Admin only)
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personal trends fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/my-trends', authenticate, authorize(['ADMIN']), getMyTrends);

export default router;
