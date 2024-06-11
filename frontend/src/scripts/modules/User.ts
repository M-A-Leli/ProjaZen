interface User {
    id: string;
    fname: string;
    lname: string;
    email: string;
    password: string;
    salt: string;
    role: string;
}

export type { User };

class UserAPI {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async fetchAllUsers(token: string): Promise<User[]> {
        const response = await fetch(`${this.baseURL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        return response.json();
    }

    async fetchUserById(id: string, token: string): Promise<User> {
        const response = await fetch(`${this.baseURL}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return response.json();
    }

    async fetchUserProfile(token: string): Promise<User> {
        const response = await fetch(`${this.baseURL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        return response.json();
    }

    async createUser(user: User, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error('Failed to create user');
        }

        return 'User created successfully';
    }

    async updateUser(id: string, user: Partial<User>, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        return 'User updated successfully';
    }

    async deleteUser(id: string, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        return 'User deleted successfully';
    }
}

export { UserAPI };
