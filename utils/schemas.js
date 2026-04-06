import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']).optional()
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required')
    })
});

export const recordSchema = z.object({
    body: z.object({
        amount: z.number().positive('Amount must be positive'),
        type: z.enum(['INCOME', 'EXPENSE']),
        category: z.string().min(1, 'Category is required'),
        date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
        description: z.string().optional()
    })
});

export const userStatusSchema = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'INACTIVE'])
    }),
    params: z.object({
        id: z.string().uuid('Invalid user ID format')
    })
});
