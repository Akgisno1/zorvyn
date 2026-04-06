import prisma from '../config/prisma.js';

export const createRecord = async (req, res) => {
    const { amount, type, category, date, description } = req.body;
    try {
        const record = await prisma.financialRecord.create({
            data: {
                amount: parseFloat(amount),
                type,
                category,
                date: new Date(date),
                description,
                userId: req.user.id
            }
        });
        res.status(201).json({
            statusCode: 201,
            message: 'Record created successfully',
            data: record
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            errorMessage: 'Failed to create record',
            err: error
        });
    }
};

export const getRecords = async (req, res) => {
    const { amount, type, category, startDate, endDate } = req.query;
    const where = {};
    if (amount) where.amount = parseFloat(amount);
    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
        where.date = {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) })
        };
    }

    try {
        const records = await prisma.financialRecord.findMany({ where });
        res.status(200).json({
            statusCode: 200,
            message: 'Records fetched successfully',
            data: records
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            errorMessage: 'Failed to fetch records',
            err: error
        });
    }
};

export const getRecordsByUser = async (req, res) => {
    const { userId } = req.params;
    const { amount, type, category, startDate, endDate } = req.query;

    // Check if user is requesting their own records or if they are admin.
    // However, the requirement says "this is only work for admin as they can get their own created records all of them".
    // This part is a bit ambiguous. Usually admins can see everything.
    // I'll implement it such that an admin can get any user's records.

    const where = { userId };
    if (amount) where.amount = parseFloat(amount);
    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
        where.date = {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) })
        };
    }

    try {
        const records = await prisma.financialRecord.findMany({ where });
        res.status(200).json({
            statusCode: 200,
            message: `Records for user ${userId} fetched successfully`,
            data: records
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            errorMessage: 'Failed to fetch user records',
            err: error
        });
    }
};

export const updateRecord = async (req, res) => {
    const { id } = req.params;
    const { amount, type, category, date, description } = req.body;
    try {
        const record = await prisma.financialRecord.findUnique({ where: { id } });
        if (!record) {
            return res.status(404).json({
                statusCode: 404,
                errorMessage: 'Record not found',
                err: null
            });
        }

        // Only the creator can update the record
        if (record.userId !== req.user.id) {
            return res.status(403).json({
                statusCode: 403,
                errorMessage: 'Unauthorized: You can only update records you created',
                err: null
            });
        }

        const updatedRecord = await prisma.financialRecord.update({
            where: { id },
            data: {
                ...(amount && { amount: parseFloat(amount) }),
                ...(type && { type }),
                ...(category && { category }),
                ...(date && { date: new Date(date) }),
                ...(description !== undefined && { description })
            }
        });

        res.status(200).json({
            statusCode: 200,
            message: 'Record updated successfully',
            data: updatedRecord
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            errorMessage: 'Failed to update record',
            err: error
        });
    }
};

export const deleteRecord = async (req, res) => {
    const { id } = req.params;
    try {
        const record = await prisma.financialRecord.findUnique({ where: { id } });
        if (!record) {
            return res.status(404).json({
                statusCode: 404,
                errorMessage: 'Record not found',
                err: null
            });
        }

        // Only the creator can delete the record
        if (record.userId !== req.user.id) {
            return res.status(403).json({
                statusCode: 403,
                errorMessage: 'Unauthorized: You can only delete records you created',
                err: null
            });
        }

        await prisma.financialRecord.delete({ where: { id } });
        res.status(200).json({
            statusCode: 200,
            message: 'Record deleted successfully',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            errorMessage: 'Failed to delete record',
            err: error
        });
    }
};
