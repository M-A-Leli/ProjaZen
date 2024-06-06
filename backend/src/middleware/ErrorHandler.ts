import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import logger from '../utils/Logger';

const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        logger.error(err.stack);  // Log the error stack
        res.status(err.status || 500).json({
            error: {
                message: err.message
            }
        });
    } else {
        logger.error('Unexpected error: ', err);
        res.status(500).json({
            error: {
                message: 'An unexpected error occurred'
            }
        });
    }
};

export default errorHandler;
