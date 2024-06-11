import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../utils/Logger';
import UserService from '../services/UserService';

interface DecodedToken {
    userId: string;
    role: string;
}

class AuthController {
    constructor() {
        this.generateAccessToken = this.generateAccessToken.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async generateAccessToken(user: any) {
        const payload = {
            userId: user.getId(),
            role: user.getRole()
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        return accessToken;
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            const { email, password } = req.body;
            const user = await UserService.getUserByEmail(email);
    
            if (!user || !(await bcrypt.compare(password, user.getPassword()))) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const accessToken = await this.generateAccessToken(user);
    
            // Determine the redirect URL based on user's role
            let redirectUrl = '/';
            if (user.getRole() === 'admin') {
                redirectUrl = '/admin/dashboard';
            } else if (user.getRole() === 'user') {
                redirectUrl = '/user/dashboard';
            }
    
            // Send the token and redirect URL to the frontend
            res.status(200).json({ token: accessToken, redirectUrl });
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            req.session.destroy((err: any) => {
                if (err) {
                    logger.error('Error destroying session: ', err);
                    return next(err);
                } else {
                    res.clearCookie('accessToken');
                    res.status(200).json({ message: 'Logout successful' });
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
