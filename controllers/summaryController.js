import prisma from '../config/prisma.js';

// Helper function for detailed summary logic
const calculateNetBalance = async (userId = null) => {
    const where = userId ? { userId } : {};
    
    const [totalRecords, incomeData, expenseData] = await Promise.all([
        prisma.financialRecord.count({ where }),
        prisma.financialRecord.aggregate({
            _sum: { amount: true },
            _count: { id: true },
            where: { ...where, type: 'INCOME' }
        }),
        prisma.financialRecord.aggregate({
            _sum: { amount: true },
            _count: { id: true },
            where: { ...where, type: 'EXPENSE' }
        })
    ]);

    const totalIncome = incomeData._sum.amount || 0;
    const totalExpenses = expenseData._sum.amount || 0;

    return {
        totalRecords,
        incomeCount: incomeData._count.id,
        incomeTotal: totalIncome,
        expenseCount: expenseData._count.id,
        expenseTotal: totalExpenses,
        netBalance: totalIncome - totalExpenses
    };
};

// 1. Total Income (Public)
export const getTotalIncome = async (req, res) => {
    try {
        const result = await prisma.financialRecord.aggregate({
            _sum: { amount: true },
            _count: { id: true },
            where: { type: 'INCOME' }
        });
        res.status(200).json({
            statusCode: 200,
            message: 'Total income fetched successfully',
            data: { total: result._sum.amount || 0, count: result._count.id }
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch total income', err: error });
    }
};

// 2. Total Expense (Public)
export const getTotalExpense = async (req, res) => {
    try {
        const result = await prisma.financialRecord.aggregate({
            _sum: { amount: true },
            _count: { id: true },
            where: { type: 'EXPENSE' }
        });
        res.status(200).json({
            statusCode: 200,
            message: 'Total expense fetched successfully',
            data: { total: result._sum.amount || 0, count: result._count.id }
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch total expense', err: error });
    }
};

// 3. My Total Income (Personal - ADMIN)
export const getMyTotalIncome = async (req, res) => {
    try {
        const result = await prisma.financialRecord.aggregate({
            _sum: { amount: true },
            _count: { id: true },
            where: { type: 'INCOME', userId: req.user.id }
        });
        res.status(200).json({
            statusCode: 200,
            message: 'My total income fetched successfully',
            data: { total: result._sum.amount || 0, count: result._count.id }
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch your total income', err: error });
    }
};

// 4. My Total Expense (Personal - ADMIN)
export const getMyTotalExpense = async (req, res) => {
    try {
        const result = await prisma.financialRecord.aggregate({
            _sum: { amount: true },
            _count: { id: true },
            where: { type: 'EXPENSE', userId: req.user.id }
        });
        res.status(200).json({
            statusCode: 200,
            message: 'My total expense fetched successfully',
            data: { total: result._sum.amount || 0, count: result._count.id }
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch your total expense', err: error });
    }
};

// 5. Net Balance (Public)
export const getNetBalance = async (req, res) => {
    try {
        const data = await calculateNetBalance();
        res.status(200).json({
            statusCode: 200,
            message: 'Net balance fetched successfully',
            data
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch net balance', err: error });
    }
};

// 6. My Net Balance (Personal - ADMIN)
export const getMyNetBalance = async (req, res) => {
    try {
        const data = await calculateNetBalance(req.user.id);
        res.status(200).json({
            statusCode: 200,
            message: 'Your net balance fetched successfully',
            data
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch your net balance', err: error });
    }
};

// 7. Category Summary (Public)
export const getCategorySummary = async (req, res) => {
    try {
        const result = await prisma.financialRecord.groupBy({
            by: ['category'],
            _sum: { amount: true },
            _count: { id: true }
        });
        res.status(200).json({
            statusCode: 200,
            message: 'Category summary fetched successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch category summary', err: error });
    }
};

// 8. My Category Summary (Personal - ADMIN)
export const getMyCategorySummary = async (req, res) => {
    try {
        const result = await prisma.financialRecord.groupBy({
            by: ['category'],
            _sum: { amount: true },
            _count: { id: true },
            where: { userId: req.user.id }
        });
        res.status(200).json({
            statusCode: 200,
            message: 'Your category summary fetched successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch your category summary', err: error });
    }
};

// 9. Recent Activity (Public)
export const getRecentActivity = async (req, res) => {
    try {
        const records = await prisma.financialRecord.findMany({
            take: 5,
            orderBy: { date: 'desc' },
            include: { user: { select: { name: true, role: true } } }
        });
        res.status(200).json({
            statusCode: 200,
            message: 'Recent activity fetched successfully',
            data: records
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch recent activity', err: error });
    }
};

// 10. My Recent Activity (Personal - ADMIN)
export const getMyRecentActivity = async (req, res) => {
    try {
        const records = await prisma.financialRecord.findMany({
            take: 5,
            where: { userId: req.user.id },
            orderBy: { date: 'desc' }
        });
        res.status(200).json({
            statusCode: 200,
            message: 'Your recent activity fetched successfully',
            data: records
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch your recent activity', err: error });
    }
};

// 11. Trends (Monthly/Weekly - Public)
export const getTrends = async (req, res) => {
    const { type = 'monthly' } = req.query;
    try {
        const data = await calculateTrends(type);
        res.status(200).json({
            statusCode: 200,
            message: `${type} trend fetched successfully`,
            data
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch trends', err: error });
    }
};

// 12. My Trends (Monthly/Weekly - Personal - ADMIN)
export const getMyTrends = async (req, res) => {
    const { type = 'monthly' } = req.query;
    try {
        const data = await calculateTrends(type, req.user.id);
        res.status(200).json({
            statusCode: 200,
            message: `Your ${type} trend fetched successfully`,
            data
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, errorMessage: 'Failed to fetch your trends', err: error });
    }
};

// Helper for Trend Calculation
const calculateTrends = async (type, userId = null) => {
    const where = userId ? { userId } : {};
    const now = new Date();
    let currentStart, previousStart, previousEnd;

    if (type === 'weekly') {
        currentStart = new Date(now.setDate(now.getDate() - now.getDay()));
        previousStart = new Date(new Date(currentStart).setDate(currentStart.getDate() - 7));
        previousEnd = currentStart;
    } else {
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEnd = currentStart;
    }

    const [current, previous] = await Promise.all([
        prisma.financialRecord.aggregate({
            _sum: { amount: true },
            where: { ...where, date: { gte: currentStart } }
        }),
        prisma.financialRecord.aggregate({
            _sum: { amount: true },
            where: { ...where, date: { gte: previousStart, lt: previousEnd } }
        })
    ]);

    const currentTotal = current._sum.amount || 0;
    const previousTotal = previous._sum.amount || 0;
    const change = previousTotal === 0 ? 100 : ((currentTotal - previousTotal) / previousTotal) * 100;

    return {
        type,
        currentTotal,
        previousTotal,
        percentageChange: change.toFixed(2) + '%'
    };
};
