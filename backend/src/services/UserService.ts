import bcrypt from 'bcrypt';
import User from '../models/User';
import createError from 'http-errors';

class UserService {
    async getAllUsers() {
        try {
            return await User.findAll();
        } catch (error) {
            throw createError(500, 'Error fetching all users');
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
            throw createError(500, `Error fetching user by ID ${id}`);
        }
    }

    async createUser(userData: any) {
        try {
            userData.password = await bcrypt.hash(userData.password, 10);
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            throw createError(500, 'Error creating user');
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
            throw createError(500, `Error updating user by ID ${id}`);
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
            throw createError(500, `Error deleting user by ID ${id}`);
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
            throw createError(500, `Error fetching user by email ${email}`);
        }
    }
}

export default new UserService();
