interface Assignment {
    id: string;
    userId: string;
    projectId: string;
}

export type { Assignment };

class AssignmentAPI {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async fetchAllAssignments(token: string): Promise<Assignment[]> {
        const response = await fetch(`${this.baseURL}/assignments`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch assignments');
        }

        return response.json();
    }

    async fetchAssignmentById(id: string, token: string): Promise<Assignment> {
        const response = await fetch(`${this.baseURL}/assignments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch assignment by ID');
        }

        return response.json();
    }

    async createAssignment(assignment: Assignment, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/assignments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(assignment)
        });

        if (!response.ok) {
            throw new Error('Failed to create assignment');
        }

        return 'Assignment created successfully';
    }

    async deleteAssignment(id: string, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/assignments/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete assignment');
        }

        return 'Assignment deleted successfully';
    }

    async getAssignmentsByUserId(userId: string, token: string): Promise<Assignment[]> {
        const response = await fetch(`${this.baseURL}/assignments/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch assignments for user with ID: ${userId}`);
        }

        return response.json();
    }

    async getAssignmentsForProject(projectId: string, token: string): Promise<Assignment[]> {
        const response = await fetch(`${this.baseURL}/assignments/project/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch assignments for project with ID: ${projectId}`);
        }

        return response.json();
    }
}

export { AssignmentAPI };
