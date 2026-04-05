const prisma =require('../config/prisma');

const getSummary = async (req, res) => {
  try {
    const income = await prisma.financialRecord.aggregate({
      _sum: { amount: true },
      where: { type: 'INCOME' }
    });
    
    const expenses = await prisma.financialRecord.aggregate({
      _sum: { amount: true },
      where: { type: 'EXPENSE' }
    });

    const categoryTotals = await prisma.financialRecord.groupBy({
      by: ['category'],
      _sum: { amount: true }
    });

    res.json({
      totalIncome: income._sum.amount || 0,
      totalExpenses: expenses._sum.amount || 0,
      netBalance: (income._sum.amount || 0) - (expenses._sum.amount || 0),
      categoryTotals
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};

module.exports={
    getSummary};