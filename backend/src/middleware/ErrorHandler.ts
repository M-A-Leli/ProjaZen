import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';

const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? {} : err.stack,
    });
};

export default errorHandler;
