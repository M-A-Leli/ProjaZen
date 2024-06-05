import bcrypt from 'bcrypt';
import { UniqueConstraintError } from 'sequelize';
import createError from 'http-errors';
import User from '../models/User';

class UserService {
    async getAllUsers() {
        try {
            return await User.findAll();
        } catch (error) {
            throw createError(500, `Error fetching all users: ${error}`);
        }
    }

    async getUserById(id: string) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw createError(404, 'User not found');
            }
            return user;
        } catch (error) {
            throw createError(500, `Error fetching user by ID ${id}: ${error}`);
        }
    }

    async createUser(userData: any) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const newUser = await User.create({
                ...userData,
                password: hashedPassword,
                salt: salt,
            });

            return newUser;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw createError(409, 'Email already exists');
            }
            throw createError(500, `Error creating user: ${error}`);
        }
    }

    async updateUser(id: string, updateData: any) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw createError(404, 'User not found');
            }
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }
            await user.update(updateData);
            return user;
        } catch (error) {
            throw createError(500, `Error updating user by ID ${id}: ${error}`);
        }
    }

    async deleteUser(id: string) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw createError(404, 'User not found');
            }
            await user.destroy();
            return true;
        } catch (error) {
            throw createError(500, `Error deleting user by ID ${id}: ${error}`);
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw createError(404, 'User not found');
            }
            return user;
        } catch (error) {
            throw createError(500, `Error fetching user by email ${email}: ${error}`);
        }
    }
}

export default new UserService();
