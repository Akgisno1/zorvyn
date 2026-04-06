import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'VIEWER', // Default to VIEWER if not provided
                status: 'ACTIVE'        // Default to ACTIVE
            }
        });
        res.status(201).json({
            statusCode: 201,
            message: 'User created successfully',
            data: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status }
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            errorMessage: 'User creation failed',
            err: error
        });
    }
};

export const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id },
            data: { status }
        });
        res.status(200).json({
            statusCode: 200,
            message: `User status updated to ${status} successfully`,
            data: { id: user.id, name: user.name, status: user.status }
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            errorMessage: 'Failed to update user status',
            err: error
        });
    }
};
