import { Request, Response, NextFunction } from 'express';
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
    
        const { fname, lname, email, password, salt, role } = req.body;
    
        try {
            const newUser = await UserService.createUser(fname, lname, email, password, salt, role);
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
    
        const user = new User(id, req.body.fname, req.body.lname, req.body.email, req.body.password, req.body.salt, req.body.role);
    
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
    // async getUserProfile(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { userId } = req.params;
    //         const userProfile = await UserService.getUserProfile(userId);
    //         res.json(userProfile);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // Update user profile
    // async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { userId } = req.params;
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
