import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../utils/Logger';
import UserService from '../services/UserService';

class AuthController {
    async generateAccessToken(user: any, req: Request) {
        const payload = {
            userId: user.id,
            role: user.role,
        };

        // Store userId in the session
        req.session.userId = user.id;
        req.session.role = user.role;

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: 'ih' });

        return accessToken;
    }

    async generateVerificationToken(data: object) {
        const verificaionToken = jwt.sign(data, process.env.JQT_SECRET as string, { expiresIn: '1h' });
        return verificaionToken;
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            // Find the user by email
            const user = await UserService.getUserByEmail(email);

            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Check if the password is correct
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET environment variable is not defined');
            }

            // Generate JWT token with userId payload
            const accessToken = this.generateAccessToken(user, req);

            //! res.status(200).json({ token, userId: user.id });
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            return res.redirect(`/${user.role}/dashboard`); //!
        } catch (error) {
            logger.error('Login error: ', error);
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // Destroy session
            req.session.destroy((err: any) => {
                if (err) {
                    logger.error('Error destroying session: ', err);
                    return next(err);
                } else {
                    // Clear the access token cookie
                    res.clearCookie('accessToken');
                    res.status(200).json({ message: 'Logout successful' });

                    return res.redirect('/login');
                }
            });
        } catch (error) {
            logger.error('Logout error: ', error);
            next(error);
        }
    }

    async emailVerification(req: Request, res: Response, next: NextFunction) {
        // !
    }
}

export default new AuthController();
