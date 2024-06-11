import { User, UserAPI } from './modules/User';
import { Project, ProjectAPI } from './modules/Project';
import { Assignment, AssignmentAPI } from './modules/Assignment';
import { Notification, NotificationAPI } from './modules/Notification';

const token = localStorage.getItem('token') as string;

const projectAPI = new ProjectAPI('http://localhost:3000/api/v1');
const userAPI = new UserAPI('http://localhost:3000/api/v1');
const notificationAPI = new NotificationAPI('http://localhost:3000/api/v1');
const assignmentAPI = new AssignmentAPI('http://localhost:3000/api/v1');

document.getElementById('nav-users')?.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById('users')?.classList.remove('hidden');
});

document.getElementById('nav-projects')?.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById('projects')?.classList.remove('hidden');
    displayAllProjects(); // Display all projects when the projects section is opened
});

document.getElementById('nav-notifications')?.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById('notifications')?.classList.remove('hidden');
    displayNotifications(); // Display notifications when the notifications section is opened
});

document.getElementById('nav-assignments')?.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById('assignments')?.classList.remove('hidden');
    displayAssignments(); // Display assignments when the assignments section is opened
});

document.getElementById('all-users-btn')?.addEventListener('click', async () => {
    try {
        const users: User[] = await userAPI.fetchAllUsers(token);
        const tbody = document.getElementById('users-table')?.querySelector('tbody') as HTMLTableSectionElement;
        tbody.innerHTML = ''; // Clear existing rows

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.fname}</td>
                <td>${user.lname}</td>
                <td>${user.email}</td>
                <td>
                    <button class="delete-btn" data-id="${user.id}"><ion-icon name="trash-outline" style="color: red;"></ion-icon></button>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const userId = (event.target as HTMLElement).closest('button')?.dataset.id as string;
                await userAPI.deleteUser(userId, token);
                // Reload the user list after deletion
                document.getElementById('all-users-btn')?.click();
            });
        });
    } catch (error) {
        console.error('Failed to fetch users', error);
    }
});

// Add event listeners for other sidebar navigation buttons
document.getElementById('nav-projects')?.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById('projects')?.classList.remove('hidden');
});

document.getElementById('nav-notifications')?.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById('notifications')?.classList.remove('hidden');
});

document.getElementById('nav-logout')?.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById('logout')?.classList.remove('hidden');
});

// Function to display all projects
async function displayAllProjects() {
    try {
        const projects: Project[] = await projectAPI.fetchAllProjects(token);
        const tbody = document.getElementById('projects-table')?.querySelector('tbody') as HTMLTableSectionElement;
        tbody.innerHTML = ''; // Clear existing rows

        projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.id}</td>
                <td>${project.name}</td>
                <td>${project.description}</td>
                <td>${project.startDate}</td>
                <td>${project.endDate}</td>
                <td>${project.status}</td>
                <td>
                    <button class="edit-btn" data-id="${project.id}">Edit</button>
                    <button class="delete-btn" data-id="${project.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const projectId = (event.target as HTMLElement).closest('button')?.dataset.id as string;
                const project = await projectAPI.fetchProjectById(projectId, token);
                // Populate the form fields with project details
                populateForm(project);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const projectId = (event.target as HTMLElement).closest('button')?.dataset.id as string;
                await projectAPI.deleteProject(projectId, token);
                // Reload the project list after deletion
                displayAllProjects();
            });
        });
    } catch (error) {
        console.error('Failed to fetch projects', error);
    }
}

// Function to populate form fields with project details for editing
function populateForm(project: Project) {
    // Populate form fields with project details for editing
    const projectNameInput = document.getElementById('project-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLInputElement;
    const startDateInput = document.getElementById('start-date') as HTMLInputElement;
    const endDateInput = document.getElementById('end-date') as HTMLInputElement;

    projectNameInput.value = project.name;
    descriptionInput.value = project.description;
    startDateInput.value = project.startDate.toString();
    endDateInput.value = project.endDate.toString();
}

// Function to handle project creation
document.getElementById('create-project-btn')?.addEventListener('click', async () => {
    const projectNameInput = document.getElementById('project-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLInputElement;
    const startDateInput = document.getElementById('start-date') as HTMLInputElement;
    const endDateInput = document.getElementById('end-date') as HTMLInputElement;

    const newProject: Project = {
        id: '', // The API will generate the ID
        name: projectNameInput.value,
        description: descriptionInput.value,
        startDate: new Date(startDateInput.value),
        endDate: new Date(endDateInput.value),
        status: 'Pending' // Default status
    };

    try {
        await projectAPI.createProject(newProject, token);
        // Clear form fields after successful creation
        projectNameInput.value = '';
        descriptionInput.value = '';
        startDateInput.value = '';
        endDateInput.value = '';
        // Reload the project list after creation
        displayAllProjects();
    } catch (error) {
        console.error('Failed to create project', error);
    }
});

// Function to handle project updating
document.getElementById('update-project-btn')?.addEventListener('click', async () => {
    const projectIdInput = document.getElementById('project-id') as HTMLInputElement;
    const projectNameInput = document.getElementById('project-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLInputElement;
    const startDateInput = document.getElementById('start-date') as HTMLInputElement;
    const endDateInput = document.getElementById('end-date') as HTMLInputElement;

    const updatedProject: Partial<Project> = {
        name: projectNameInput.value,
        description: descriptionInput.value,
        startDate: new Date(startDateInput.value),
        endDate: new Date(endDateInput.value)
    };

    try {
        await projectAPI.updateProject(projectIdInput.value, updatedProject, token);
        // Reload the project list after updating
        displayAllProjects();
    } catch (error) {
        console.error('Failed to update project', error);
    }
});

// Function to handle project editing cancellation
document.getElementById('cancel-edit-btn')?.addEventListener('click', () => {
    // Clear form fields and hide the edit form
    clearForm();
});

// Function to clear form fields and hide the edit form
function clearForm() {
    const projectIdInput = document.getElementById('project-id') as HTMLInputElement;
    const projectNameInput = document.getElementById('project-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLInputElement;
    const startDateInput = document.getElementById('start-date') as HTMLInputElement;
    const endDateInput = document.getElementById('end-date') as HTMLInputElement;

    projectIdInput.value = '';
    projectNameInput.value = '';
    descriptionInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';

    // Hide the edit form
    document.getElementById('edit-project-form')?.classList.add('hidden');
}

// Function to display notifications for the current user
async function displayNotifications() {
    try {
        const userId = 'current-user-id'; // Replace with the actual user ID
        const notifications: Notification[] = await notificationAPI.fetchNotificationsByUserId(userId, token);
        const container = document.getElementById('notifications-container') as HTMLDivElement;
        container.innerHTML = ''; // Clear existing notifications

        notifications.forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.classList.add('notification');
            notificationElement.innerHTML = `
                <p>${notification.message}</p>
                <button class="mark-as-read" data-id="${notification.id}">Mark as Read</button>
                <button class="delete-notification" data-id="${notification.id}">Delete</button>
            `;
            container.appendChild(notificationElement);
        });

        // Add event listeners for mark as read and delete buttons
        document.querySelectorAll('.mark-as-read').forEach(button => {
            button.addEventListener('click', async (event) => {
                const notificationId = (event.target as HTMLElement).dataset.id as string;
                await markNotificationAsRead(notificationId);
            });
        });

        document.querySelectorAll('.delete-notification').forEach(button => {
            button.addEventListener('click', async (event) => {
                const notificationId = (event.target as HTMLElement).dataset.id as string;
                await deleteNotification(notificationId);
            });
        });
    } catch (error) {
        console.error('Failed to fetch notifications', error);
    }
}

// Function to handle creating a new notification
document.getElementById('create-notification-btn')?.addEventListener('click', async () => {
    const message = prompt('Enter notification message:');
    if (message) {
        const newNotification: Notification = {
            id: '', // The API will generate the ID
            userId: 'current-user-id', // Replace with the actual user ID
            message: message,
            read: false // New notifications are initially unread
        };
        try {
            await notificationAPI.createNotification(newNotification, token);
            // Reload notifications after creating a new one
            displayNotifications();
        } catch (error) {
            console.error('Failed to create notification', error);
        }
    }
});

// Function to mark a notification as read
async function markNotificationAsRead(notificationId: string) {
    try {
        await notificationAPI.markNotificationAsRead(notificationId, token);
        // Reload notifications after marking as read
        displayNotifications();
    } catch (error) {
        console.error('Failed to mark notification as read', error);
    }
}

// Function to delete a notification
async function deleteNotification(notificationId: string) {
    try {
        await notificationAPI.deleteNotification(notificationId, token);
        // Reload notifications after deletion
        displayNotifications();
    } catch (error) {
        console.error('Failed to delete notification', error);
    }
}

// Function to display assignments for the current user
async function displayAssignments() {
    try {
        const userId = 'current-user-id'; // Replace with the actual user ID
        const assignments: Assignment[] = await assignmentAPI.getAssignmentsByUserId(userId, token);
        const container = document.getElementById('assignments-container') as HTMLDivElement;
        container.innerHTML = ''; // Clear existing assignments

        assignments.forEach(assignment => {
            const assignmentElement = document.createElement('div');
            assignmentElement.classList.add('assignment');
            assignmentElement.innerHTML = `
                <p>Assignment ID: ${assignment.id}</p>
                <p>Project ID: ${assignment.projectId}</p>
                <button class="delete-assignment" data-id="${assignment.id}">Delete</button>
            `;
            container.appendChild(assignmentElement);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-assignment').forEach(button => {
            button.addEventListener('click', async (event) => {
                const assignmentId = (event.target as HTMLElement).dataset.id as string;
                await deleteAssignment(assignmentId);
            });
        });
    } catch (error) {
        console.error('Failed to fetch assignments', error);
    }
}

// Function to handle creating a new assignment
document.getElementById('create-assignment-btn')?.addEventListener('click', async () => {
    const userId = 'current-user-id'; // Replace with the actual user ID
    const projectId = 'selected-project-id'; // Replace with the actual project ID
    const newAssignment: Assignment = {
        id: '', // The API will generate the ID
        userId: userId,
        projectId: projectId
    };
    try {
        await assignmentAPI.createAssignment(newAssignment, token);
        // Reload assignments after creating a new one
        displayAssignments();
    } catch (error) {
        console.error('Failed to create assignment', error);
    }
});

// Function to delete an assignment
async function deleteAssignment(assignmentId: string) {
    try {
        await assignmentAPI.deleteAssignment(assignmentId, token);
        // Reload assignments after deletion
        displayAssignments();
    } catch (error) {
        console.error('Failed to delete assignment', error);
    }
}
