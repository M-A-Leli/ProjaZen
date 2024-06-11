import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserService from '../services/UserService';
import User from '../models/User';

class UserController {
    constructor() {
        this.fetchAllUsers = this.fetchAllUsers.bind(this);
        this.fetchUserById = this.fetchUserById.bind(this);
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    async fetchAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users.map((user: User) => this.transformUser(user)));
        } catch (error) {
            next(error);
        }
    }

    async fetchUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            res.json(this.transformUser(user));
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fname, lname, email, password, role } = req.body;

        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);

            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await UserService.createUser(fname, lname, email, hashedPassword, salt, role);

            res.status(201).json(this.transformUser(newUser));
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // const updatedUserData = {
        //     id: id,
        //     fname: req.body.fname,
        //     lname: req.body.lname,
        //     email: req.body.email,
        //     password: req.body.password, // Assuming this field can be updated
        //     salt: req.body.salt, // Assuming this field can be updated
        //     role: req.body.role // Assuming this field can be updated
        // };

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User(id, req.body.fname, req.body.lname, req.body.email, hashedPassword, salt, req.body.role);

        try {
            const updatedUser = await UserService.updateUser(user);

            res.json(this.transformUser(updatedUser));
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletionStatus = await UserService.deleteUser(id);

            if (deletionStatus) {
                res.status(204).send('User deleted successfully.');
            }
        } catch (error) {
            next(error);
        }
    }

    // Get user profile
    async getUserProfile(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('Controller - User ID:', req.user?.id);
            console.log('Controller - User Role:', req.user?.role);

            // Use the correct userId from the authenticated user's token
            const userId = req.user?.id as string;
            const userProfile = await UserService.getUserById(userId);

            console.log('userprofile:', userProfile);
            res.json(userProfile);
        } catch (error) {
            next(error);
        }
    }

    // Update user profile
    // async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const userId = req.user?.id;
    //         const updatedFields = req.body; // Fields user wants to update
    //         const updatedUserProfile = await UserService.updateUserProfile(userId, updatedFields);
    //         res.json(updatedUserProfile);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    private transformUser(user: User) {
        return {
            id: user.getId(),
            fname: user.getFname(),
            lname: user.getLname(),
            email: user.getEmail(),
            role: user.getRole()
        };
    }
}

export default new UserController();
