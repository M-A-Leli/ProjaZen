import bcrypt from 'bcrypt';
import { UniqueConstraintError } from 'sequelize';
import createError from 'http-errors';
import User from '../models/User';
import logger from '../utils/Logger';

class UserService {
    async getAllUsers() {
        try {
            return await User.findAll();
        } catch (error) {
            if (error instanceof createError.HttpError) {
                throw error;
            } else if (error instanceof Error) {
                throw createError(500, `Unexpected error: ${error.message}`);
            } else {
                throw createError(500, 'Unexpected error occurred');
            }
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
            if (error instanceof createError.HttpError) {
                throw error;
            } else if (error instanceof Error) {
                throw createError(500, `Unexpected error: ${error.message}`);
            } else {
                throw createError(500, 'Unexpected error occurred');
            }
        }
    }

    async createUser(userData: any) {
        try {
            const existingUser = await User.findOne({ where: { email: userData.email } });
            
            if (existingUser) {
                throw createError(409, 'Email already exists');
            }
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const newUser = await User.create({
                ...userData,
                password: hashedPassword,
                salt: salt,
            });

            return newUser;
        } catch (error) {
            if (error instanceof createError.HttpError) {
                throw error;
            } else if (error instanceof Error) {
                throw createError(500, `Unexpected error: ${error.message}`);
            } else {
                throw createError(500, 'Unexpected error occurred');
            }
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
            if (error instanceof createError.HttpError) {
                throw error;
            } else if (error instanceof Error) {
                throw createError(500, `Unexpected error: ${error.message}`);
            } else {
                throw createError(500, 'Unexpected error occurred');
            }
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
            if (error instanceof createError.HttpError) {
                throw error;
            } else if (error instanceof Error) {
                throw createError(500, `Unexpected error: ${error.message}`);
            } else {
                throw createError(500, 'Unexpected error occurred');
            }
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
            if (error instanceof createError.HttpError) {
                throw error;
            } else if (error instanceof Error) {
                throw createError(500, `Unexpected error: ${error.message}`);
            } else {
                throw createError(500, 'Unexpected error occurred');
            }
        }
    }

    async getUserProfile(id: string) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw createError(404, 'User not found');
            }
            return user;
        } catch (error) {
            if (error instanceof createError.HttpError) {
                throw error;
            } else if (error instanceof Error) {
                throw createError(500, `Unexpected error: ${error.message}`);
            } else {
                throw createError(500, 'Unexpected error occurred');
            }
        }
    }

    async updateUserProfile(id: string, updateData: any) {
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
            if (error instanceof createError.HttpError) {
                throw error;
            } else if (error instanceof Error) {
                throw createError(500, `Unexpected error: ${error.message}`);
            } else {
                throw createError(500, 'Unexpected error occurred');
            }
        }
    }
}

export default new UserService();
