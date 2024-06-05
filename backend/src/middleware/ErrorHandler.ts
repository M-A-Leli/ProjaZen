import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
// import logger from '../utils/Logger';

const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    // logger.error(`${err.status || 500} - ${err.message}`);

    res.status(err.status || 500);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? {} : err.stack,
    });
};

export default errorHandler;
