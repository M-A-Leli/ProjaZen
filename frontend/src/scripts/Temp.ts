import '../styles/adminDashboard.css';
import { User, UserAPI } from './modules/User';
import { Project, ProjectAPI } from './modules/Project';
import { Assignment, AssignmentAPI } from './modules/Assignment';
// import { Notification, NotificationAPI } from './modules/Notification';

class AdminDashboard {
    private navItems: NodeListOf<Element>;
    private sections: NodeListOf<HTMLElement>;
    private userAPI: UserAPI;
    private projectAPI: ProjectAPI;
    private assignmentAPI: AssignmentAPI;
    // private notificationAPI: NotificationAPI;
    private token: string;

    constructor(navSelector: string, sectionSelector: string, baseURL: string, token: string) {
        this.navItems = document.querySelectorAll(navSelector);
        this.sections = document.querySelectorAll(sectionSelector);
        this.userAPI = new UserAPI(baseURL);
        this.projectAPI = new ProjectAPI(baseURL);
        this.assignmentAPI = new AssignmentAPI(baseURL);
        // this.notificationAPI = new NotificationAPI(baseURL);
        this.token = token;

        this.initializeEventListeners();
        this.showSection('profile-section'); // Show the default section on load
        this.displayUserProfile();
        this.initializeProjectSection();
        this.initializeUserSection();
        this.initializeAssignmentSection();
    }

    private initializeEventListeners(): void {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = (item as HTMLElement).id.replace('nav-', '');
                this.showSection(`${id}-section`);
            });
        });
    }

    private hideAllSections(): void {
        this.sections.forEach(section => {
            section.style.display = 'none';
        });
    }

    private showSection(sectionId: string): void {
        this.hideAllSections();
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
        }
    }

    private async displayUserProfile(): Promise<void> {
        try {
            const user = await this.userAPI.fetchUserProfile(this.token);
            document.getElementById('profile-name')!.innerText = `${user.fname} ${user.lname}`;
            document.getElementById('profile-email')!.innerText = user.email;
            // Update the welcome message or other elements as needed
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }

    private async fetchProjects(): Promise<Project[]> {
        try {
            return await this.projectAPI.fetchAllProjects(this.token);
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    }

    private async displayProjects(): Promise<void> {
        const projects = await this.fetchProjects();
        const tbody = document.querySelector('#projects-container tbody')!;
        tbody.innerHTML = '';

        projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.name}</td>
                <td>${project.description}</td>
                <td>${new Date(project.startDate).toLocaleDateString()}</td>
                <td>${new Date(project.endDate).toLocaleDateString()}</td>
                <td>${project.status}</td>
                <td>
                    <button class="edit-project" data-id="${project.id}">Edit</button>
                    <button class="delete-project" data-id="${project.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.bindProjectButtons();
    }

    private bindProjectButtons(): void {
        document.querySelectorAll('.edit-project').forEach(button => {
            button.addEventListener('click', (event) => {
                const projectId = (event.currentTarget as HTMLElement).dataset.id!;
                this.showUpdateProjectModal(projectId);
            });
        });

        document.querySelectorAll('.delete-project').forEach(button => {
            button.addEventListener('click', (event) => {
                const projectId = (event.currentTarget as HTMLElement).dataset.id!;
                this.showDeleteProjectModal(projectId);
            });
        });
    }

    private initializeProjectSection(): void {
        this.displayProjects();
        document.getElementById('display-create-project-modal')!.addEventListener('click', () => {
            this.showCreateProjectModal();
        });
        document.getElementById('hide-create-project-modal')!.addEventListener('click', () => {
            this.hideCreateProjectModal();
        });
        document.getElementById('create-project-form')!.addEventListener('submit', (event) => {
            event.preventDefault();
            this.createProject();
        });
    }

    private async createProject(): Promise<void> {
        const name = (document.querySelector('input[name="project-name"]') as HTMLInputElement).value;
        const description = (document.querySelector('textarea[name="project-description"]') as HTMLTextAreaElement).value;
        const startDate = (document.querySelector('input[name="project-start-date"]') as HTMLInputElement).value;
        const endDate = (document.querySelector('input[name="project-end-date"]') as HTMLInputElement).value;

        const project: Project = {
            id: '',
            name,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'unassigned'
        };

        try {
            await this.projectAPI.createProject(project, this.token);
            this.hideCreateProjectModal();
            this.displayProjects();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    }

    private showCreateProjectModal(): void {
        document.getElementById('create-project-modal')!.style.display = 'block';
    }

    private hideCreateProjectModal(): void {
        document.getElementById('create-project-modal')!.style.display = 'none';
    }

    private async showUpdateProjectModal(projectId: string): Promise<void> {
        // Fetch project details and populate the update form
        try {
            const project = await this.projectAPI.fetchProjectById(projectId, this.token);
            (document.querySelector('#update-project-form input[name="project-name"]') as HTMLInputElement).value = project.name;
            (document.querySelector('#update-project-form textarea[name="project-description"]') as HTMLTextAreaElement).value = project.description;
            (document.querySelector('#update-project-form input[name="project-start-date"]') as HTMLInputElement).value = new Date(project.startDate).toISOString().split('T')[0];
            (document.querySelector('#update-project-form input[name="project-end-date"]') as HTMLInputElement).value = new Date(project.endDate).toISOString().split('T')[0];

            document.getElementById('update-project-modal')!.style.display = 'block';

            document.getElementById('update-project-form')!.addEventListener('submit', (event) => {
                event.preventDefault();
                this.updateProject(projectId);
            });
        } catch (error) {
            console.error('Error fetching project for update:', error);
        }
    }

    private hideUpdateProjectModal(): void {
        document.getElementById('update-project-modal')!.style.display = 'none';
    }

    private async updateProject(projectId: string): Promise<void> {
        const name = (document.querySelector('#update-project-form input[name="project-name"]') as HTMLInputElement).value;
        const description = (document.querySelector('#update-project-form textarea[name="project-description"]') as HTMLTextAreaElement).value;
        const startDate = (document.querySelector('#update-project-form input[name="project-start-date"]') as HTMLInputElement).value;
        const endDate = (document.querySelector('#update-project-form input[name="project-end-date"]') as HTMLInputElement).value;

        const project: Partial<Project> = {
            name,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        };

        try {
            await this.projectAPI.updateProject(projectId, project, this.token);
            this.hideUpdateProjectModal();
            this.displayProjects();
        } catch (error) {
            console.error('Error updating project:', error);
        }
    }

    private async showDeleteProjectModal(projectId: string): Promise<void> {
        document.getElementById('delete-project-modal')!.style.display = 'block';

        document.getElementById('confirm-delete-project-btn')!.addEventListener('click', async () => {
            try {
                await this.projectAPI.deleteProject(projectId, this.token);
                this.hideDeleteProjectModal();
                this.displayProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        });

        document.getElementById('cancel-delete-project-btn')!.addEventListener('click', () => {
            this.hideDeleteProjectModal();
        });
    }

    private hideDeleteProjectModal(): void {
        document.getElementById('delete-project-modal')!.style.display = 'none';
    }

    private async fetchUsers(): Promise<User[]> {
        try {
            return await this.userAPI.fetchAllUsers(this.token);
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    private async displayUsers(): Promise<void> {
        const users = await this.fetchUsers();
        const tbody = document.querySelector('#users-container tbody')!;
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.fname}</td>
                <td>${user.lname}</td>
                <td>${user.email}</td>
                <td>
                    <button class="edit-user" data-id="${user.id}">Edit</button>
                    <button class="delete-user" data-id="${user.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.bindUserButtons();
    }

    private bindUserButtons(): void {
        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', (event) => {
                const userId = (event.currentTarget as HTMLElement).dataset.id!;
                this.showUpdateUserModal(userId);
            });
        });

        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', (event) => {
                const userId = (event.currentTarget as HTMLElement).dataset.id!;
                this.showDeleteUserModal(userId);
            });
        });
    }

    private initializeUserSection(): void {
        this.displayUsers();
        document.getElementById('display-create-user-modal')!.addEventListener('click', () => {
            this.showCreateUserModal();
        });
        document.getElementById('hide-create-user-modal')!.addEventListener('click', () => {
            this.hideCreateUserModal();
        });
        document.getElementById('create-user-form')!.addEventListener('submit', (event) => {
            event.preventDefault();
            this.createUser();
        });
    }

    private async createUser(): Promise<void> {
        const fname = (document.querySelector('input[name="user-fname"]') as HTMLInputElement).value;
        const lname = (document.querySelector('input[name="user-lname"]') as HTMLInputElement).value;
        const email = (document.querySelector('input[name="user-email"]') as HTMLInputElement).value;
        const password = (document.querySelector('input[name="user-password"]') as HTMLInputElement).value;

        const user: User = {
            id: '',
            fname,
            lname,
            email,
            password,
            salt: '',
            role: 'user'
        };

        try {
            await this.userAPI.createUser(user, this.token);
            this.hideCreateUserModal();
            this.displayUsers();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    private showCreateUserModal(): void {
        document.getElementById('create-user-modal')!.style.display = 'block';
    }

    private hideCreateUserModal(): void {
        document.getElementById('create-user-modal')!.style.display = 'none';
    }

    private async showUpdateUserModal(userId: string): Promise<void> {
        // Fetch user details and populate the update form
        try {
            const user = await this.userAPI.fetchUserById(userId, this.token);
            (document.querySelector('#update-user-form input[name="user-fname"]') as HTMLInputElement).value = user.fname;
            (document.querySelector('#update-user-form input[name="user-lname"]') as HTMLInputElement).value = user.lname;
            (document.querySelector('#update-user-form input[name="user-email"]') as HTMLInputElement).value = user.email;

            document.getElementById('update-user-modal')!.style.display = 'block';

            document.getElementById('update-user-form')!.addEventListener('submit', (event) => {
                event.preventDefault();
                this.updateUser(userId);
            });
        } catch (error) {
            console.error('Error fetching user for update:', error);
        }
    }

    private hideUpdateUserModal(): void {
        document.getElementById('update-user-modal')!.style.display = 'none';
    }

    private async updateUser(userId: string): Promise<void> {
        const fname = (document.querySelector('#update-user-form input[name="user-fname"]') as HTMLInputElement).value;
        const lname = (document.querySelector('#update-user-form input[name="user-lname"]') as HTMLInputElement).value;
        const email = (document.querySelector('#update-user-form input[name="user-email"]') as HTMLInputElement).value;

        const user: Partial<User> = {
            fname,
            lname,
            email,
        };

        try {
            await this.userAPI.updateUser(userId, user, this.token);
            this.hideUpdateUserModal();
            this.displayUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    private async showDeleteUserModal(userId: string): Promise<void> {
        document.getElementById('delete-user-modal')!.style.display = 'block';

        document.getElementById('confirm-delete-user-btn')!.addEventListener('click', async () => {
            try {
                await this.userAPI.deleteUser(userId, this.token);
                this.hideDeleteUserModal();
                this.displayUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        });

        document.getElementById('cancel-delete-user-btn')!.addEventListener('click', () => {
            this.hideDeleteUserModal();
        });
    }

    private hideDeleteUserModal(): void {
        document.getElementById('delete-user-modal')!.style.display = 'none';
    }

    private async fetchAssignments(): Promise<Assignment[]> {
        try {
            return await this.assignmentAPI.fetchAllAssignments(this.token);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            return [];
        }
    }

    private async displayAssignments(): Promise<void> {
        const assignments = await this.fetchAssignments();
        const tbody = document.querySelector('#assignments-container tbody')!;
        tbody.innerHTML = '';

        assignments.forEach((assignment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${assignment.projectId}</td>
                <td>${assignment.userId}</td>
                <td>
                    <button class="delete-assignment" data-id="${assignment.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.bindAssignmentButtons();
    }

    private bindAssignmentButtons(): void {
        document.querySelectorAll('.delete-assignment').forEach(button => {
            button.addEventListener('click', (event) => {
                const assignmentId = (event.currentTarget as HTMLElement).dataset.id!;
                this.showDeleteAssignmentModal(assignmentId);
            });
        });
    }

    private initializeAssignmentSection(): void {
        this.displayAssignments();
        document.getElementById('display-match-maker')!.addEventListener('click', () => {
            this.showMatchMaker();
        });
        document.getElementById('hide-match-maker')!.addEventListener('click', () => {
            this.hideMatchMaker();
        });
        document.getElementById('create-assignment-btn')!.addEventListener('click', () => {
            this.createAssignment();
        });
    }

    private async createAssignment(): Promise<void> {
    const selectedUserId = (document.querySelector('#available-users-container input[type="radio"]:checked') as HTMLInputElement)?.value;
        const selectedProjectId = (document.querySelector('#available-projects-container input[type="radio"]:checked') as HTMLInputElement)?.value;

        if (!selectedUserId || !selectedProjectId) {
            console.error('Please select a user and a project.');
            return;
        }

        const assignment: Assignment = {
            id: '', // Assigning an empty string for now, the server will generate the ID
            userId: selectedUserId,
            projectId: selectedProjectId,
        };

        try {
            await this.assignmentAPI.createAssignment(assignment, this.token);
            this.hideMatchMaker();
            this.displayAssignments();
        } catch (error) {
            console.error('Error creating assignment:', error);
        }
    }

    private async showDeleteAssignmentModal(assignmentId: string): Promise<void> {
        document.getElementById('delete-assignment-modal')!.style.display = 'block';

        document.getElementById('confirm-delete-assignment-btn')!.addEventListener('click', async () => {
            try {
                await this.assignmentAPI.deleteAssignment(assignmentId, this.token);
                this.hideDeleteAssignmentModal();
                this.displayAssignments();
            } catch (error) {
                console.error('Error deleting assignment:', error);
            }
        });

        document.getElementById('cancel-delete-assignment-btn')!.addEventListener('click', () => {
            this.hideDeleteAssignmentModal();
        });
    }

    private hideDeleteAssignmentModal(): void {
        document.getElementById('delete-assignment-modal')!.style.display = 'none';
    }

    // private async fetchAvailableUsers(): Promise<User[]> {
    //     // Implement method to fetch available users
    // }

    // private async fetchAvailableProjects(): Promise<Project[]> {
    //     // Implement method to fetch available projects
    // }

    private showMatchMaker(): void {
        document.getElementById('match-maker')!.style.display = 'block';
    }

    private hideMatchMaker(): void {
        document.getElementById('match-maker')!.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'http://localhost:3000/api/v1';
    const token = localStorage.getItem('token') as string
    // const userId = localStorage.getItem('userId') as string
    new AdminDashboard('.nav-item', 'section', baseURL, token);
});
