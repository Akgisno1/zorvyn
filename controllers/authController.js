import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                statusCode: 401,
                errorMessage: 'Invalid credentials',
                err: null
            });
        }

        if (user.status === 'INACTIVE') {
            return res.status(403).json({
                statusCode: 403,
                errorMessage: 'Account is inactive. Please contact your admin.',
                err: null
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            statusCode: 200,
            message: 'Login successful',
            data: { 
                token, 
                user: { id: user.id, name: user.name, email: user.email, role: user.role } 
            }
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            errorMessage: 'Internal Server Error during login',
            err: error
        });
    }
};

export const logout = async (req, res) => {
    // In JWT-based auth, logout is typically handled client-side by deleting the token.
    // However, we return a success response as requested.
    res.status(200).json({
        statusCode: 200,
        message: 'Logout successful',
        data: null
    });
};
