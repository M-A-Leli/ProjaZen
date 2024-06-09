interface Project {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: string;
}

export type { Project };

class ProjectAPI {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async fetchAllProjects(token: string): Promise<Project[]> {
        const response = await fetch(`${this.baseURL}/projects`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }

        return response.json();
    }

    async fetchProjectById(id: string, token: string): Promise<Project> {
        const response = await fetch(`${this.baseURL}/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch project by ID');
        }

        return response.json();
    }

    async createProject(project: Project, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(project)
        });

        if (!response.ok) {
            throw new Error('Failed to create project');
        }

        return 'Project created successfully';
    }

    async updateProject(id: string, project: Partial<Project>, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/projects/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(project)
        });

        if (!response.ok) {
            throw new Error('Failed to update project');
        }

        return 'Project updated successfully';
    }

    async deleteProject(id: string, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete project');
        }

        return 'Project deleted successfully';
    }

    async getProjectsByStatus(status: string, token: string): Promise<Project[]> {
        const response = await fetch(`${this.baseURL}/projects/${status}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch projects by status: ${status}`);
        }

        return response.json();
    }

    async getProjectByName(name: string, token: string): Promise<Project[]> {
        const response = await fetch(`${this.baseURL}/projects/${name}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch project by name: ${name}`);
        }

        return response.json();
    }

    async markProjectAsCompleted(id: string, token: string): Promise<string> {
        const response = await fetch(`${this.baseURL}/projects/${id}/mark-completed`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to mark project as completed');
        }

        return 'Project marked as completed successfully';
    }
}

export { ProjectAPI };
