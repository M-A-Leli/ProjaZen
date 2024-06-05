import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import createError from 'http-errors';
import UserService from '../services/UserService';
import logger from '../utils/Logger';
import User from '../models/User';

class UserController {
    async fetchAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users.map(user => this.transformUser(user)));
        } catch (error) {
            logger.error('Error fetching all users:', error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    async fetchUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            if (!user) {
                return next(createError(404, 'User not found'));
            }
            res.json(this.transformUser(user));
        } catch (error) {
            logger.error(`Error fetching user by ID ${req.params.id}:`, error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newUser = await UserService.createUser(req.body);
            res.status(201).json(this.transformUser(newUser));
        } catch (error) {
            logger.error('Error creating user:', error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedUser = await UserService.updateUser(id, req.body);
            if (!updatedUser) {
                return next(createError(404, 'User not found'));
            }
            res.json(this.transformUser(updatedUser));
        } catch (error) {
            logger.error(`Error updating user by ID ${req.params.id}:`, error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletedUser = await UserService.deleteUser(id);
            if (!deletedUser) {
                return next(createError(404, 'User not found'));
            }
            res.status(204).send();
        } catch (error) {
            logger.error(`Error deleting user by ID ${req.params.id}:`, error);
            next(createError(500, 'Internal Server Error'));
        }
    }
    
    async getUserProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
    
            const user = await UserService.getUserById(req.user.id);
            res.json(this.transformUser(user));
        } catch (error) {
            logger.error('Error fetching user profile:', error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    async updateUserProfile(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedUser = await UserService.updateUser(id, req.body);
            if (!updatedUser) {
                return next(createError(404, 'User not found'));
            }
            res.json(this.transformUser(updatedUser));
        } catch (error) {
            logger.error(`Error updating user by ID ${req.params.id}:`, error);
            next(createError(500, 'Internal Server Error'));
        }
    }

    private transformUser(user: User) {
        return {
            id: user.id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}

export default new UserController();
