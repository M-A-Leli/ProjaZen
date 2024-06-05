import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        req.user = {
            id: decoded.userId,
            role: decoded.role
        };
        next();
    } catch (error) {
        return next(createError(401, 'Invalid Token'));
    }
};

const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        if (req.headers.accept?.includes('application/json')) {
            return res.status(401).json({ message: 'Unauthorized' });
        } else {
            return res.redirect('/login');
        }
    }
    next();
};

const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        if (req.headers.accept?.includes('application/json')) {
            return res.status(401).json({ message: 'Unauthorized' });
        } else {
            return res.redirect('/login');
        }
    }
    if (req.user.role !== 'admin') {
        if (req.headers.accept?.includes('application/json')) {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        } else {
            return res.redirect('/login');
        }
    }
    next();
};

export { authenticateToken, authorizeUser, authorizeAdmin };
