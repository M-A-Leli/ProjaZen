import '../styles/adminDashboard.css';
 
// Interface for Project
interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
}
 
// Sample fake API URL
const fakeApiUrl = 'http://localhost:3000/projects/';
 
// Select all sidebar items and sections
const sidebarItems = document.querySelectorAll('.sidebar div');
const sections = document.querySelectorAll('.section');
const createProjectButton = document.querySelector('.create-project-button button') as HTMLButtonElement;
const projectForm = document.querySelector('.project-form') as HTMLFormElement;
const container = document.querySelector('.container') as HTMLElement | null;
const updateProjectButtons = document.querySelectorAll('.update-project-button') as NodeListOf<HTMLButtonElement>;
const deleteProjectButtons = document.querySelectorAll('.delete-project-button') as NodeListOf<HTMLButtonElement>;
const updateForm = document.querySelector('.update-form') as HTMLElement;
const deleteProjectDiv = document.querySelector('.delete-project') as HTMLElement;
const deleteYesButton = document.getElementById('yes') as HTMLButtonElement;
const deleteNoButton = document.getElementById('no') as HTMLButtonElement;
 
const userButtons = document.querySelectorAll('.user-buttons button');
const registeredUsersTable = document.querySelector('.registered-users') as HTMLElement;
const assignedUsersTable = document.querySelector('.assigned-users') as HTMLElement;
const unassignedUsersTable = document.querySelector('.unassigned-users') as HTMLElement;
 
if (container) {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    document.body.appendChild(modalOverlay);
    modalOverlay.appendChild(projectForm);
    modalOverlay.appendChild(updateForm);
    modalOverlay.appendChild(deleteProjectDiv);
 
    // Function to show the selected section and hide others
    function showSection(selectedSectionId: string) {
        sections.forEach(section => {
            const htmlSection = section as HTMLElement; // Type assertion
            if (htmlSection.id === selectedSectionId) {
                htmlSection.style.display = 'block';
            } else {
                htmlSection.style.display = 'none';
            }
        });
    }
 
    // Add event listeners to sidebar items
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.id.replace('nav-', ''); // Get the section id from the clicked item
            showSection(targetId);
        });
    });
 
    // Show the default section (projects) on load
    showSection('projects');
 
    // Hide the project creation form, update form, and delete div by default
    projectForm.style.display = 'none';
    updateForm.style.display = 'none';
    deleteProjectDiv.style.display = 'none';
 
    // Function to show modal and apply blur effect
    function showModal() {
        modalOverlay.style.display = 'flex';
        container!.classList.add('blur');  // Non-null assertion operator used here
    }
 
    // Function to hide modal and remove blur effect
    function hideModal() {
        modalOverlay.style.display = 'none';
        container!.classList.remove('blur');  // Non-null assertion operator used here
    }
 
    // Function to fetch projects from the fake API
    async function fetchProjectsFromApi() {
        try {
            const response = await fetch(fakeApiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch projects from API:', error);
            return [];
        }
    }
 
    // Function to display projects in the projects table
    function displayProjects(projects: Project[]) {
        const projectsTable = document.querySelector('.projects-table table') as HTMLTableElement;
 
        projects.forEach(project => {
            const row = projectsTable.insertRow(-1); // Insert a row at the end of the table
            row.innerHTML = `
                <td>${project.name}</td>
                <td>${project.description}</td>
                <td>${project.startDate}</td>
                <td>${project.endDate}</td>
                <td>${project.status}</td>
                <td style="display: flex; gap: 5px;">
                    <button class="update-project-button">Update</button>
                    <button class="delete-project-button">Delete</button>
                </td>
            `;
        });
    }
 
    // Function to count projects by status
    function countProjectsByStatus(projects: Project[], status: string): number {
        return projects.filter(project => project.status === status).length;
    }
 
    // Function to update project counts in the HTML
    function updateProjectCounts(projects: Project[]) {
        const statuses = ['unassigned', 'assigned', 'completed', 'expired', 'overdue'];
        statuses.forEach(status => {
            const count = countProjectsByStatus(projects, status);
            const countElement = document.getElementById(`${status}-project-count`);
            if (countElement) {
                countElement.textContent = count.toString();
            }
        });
    }
 
    // Fetch projects from the API and display them in the projects table
    fetchProjectsFromApi().then(projects => {
        displayProjects(projects);
        updateProjectCounts(projects); // Update the project counts
    });
 
    // Function to send project to fake API
    async function sendProjectToApi(project: Project) {
        try {
            console.log(project)
            const response = await fetch(fakeApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(project)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Project added to API:', data);
        } catch (error) {
            console.error('Failed to add project to API:', error);
        }
    }
 
    // Modify the project form submit event listener to handle project creation
    projectForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from actually submitting
 
        // Get form data
        const projectName = (document.getElementById('project-name') as HTMLInputElement).value;
        const projectDescription = (document.querySelector('.project-form textarea') as HTMLTextAreaElement).value;
        const startDate = (document.getElementById('start-date') as HTMLInputElement).value;
        const endDate = (document.getElementById('end-date') as HTMLInputElement).value;

        console.log(projectName);
        console.log(endDate);
        console.log(startDate);
        
 
        // Create a new project object
        const newProject: Project = {
            id: Date.now(), // Using timestamp as a simple unique ID
            name: projectName,
            description: projectDescription,
            startDate: startDate,
            endDate: endDate,
            status: 'Unassigned'
        };
 
        // Send the new project to the fake API
        await sendProjectToApi(newProject);
 
        fetchProjectsFromApi().then(projects => {
            displayProjects(projects);
            updateProjectCounts(projects); // Update the project counts
        });
 
        // Hide the project creation form and modal
        projectForm.style.display = 'none';
        hideModal();
 
        // Reset the form
        projectForm.reset(); // No more error here
    });
 
    // Show the project creation form when clicking the "Create New Project" button
    createProjectButton.addEventListener('click', () => {
        projectForm.style.display = 'block';
        showModal();
    });
 
    // Toggle the visibility of the update form when the "Update" button is clicked
    updateProjectButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (updateForm.style.display === 'none' || updateForm.style.display === '') {
                updateForm.style.display = 'block';
                projectForm.style.display = 'none'; // Ensure the project form is hidden
                showModal();
            } else {
                updateForm.style.display = 'none';
                hideModal();
            }
        });
    });
 
    // Hide the update form when the update form is submitted
    updateForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from actually submitting
        updateForm.style.display = 'none';
        hideModal();
    });
 
    // Show the delete confirmation div when a delete button is clicked
    deleteProjectButtons.forEach(button => {
        button.addEventListener('click', () => {
            deleteProjectDiv.style.display = 'block';
            showModal();
        });
    });
 
    // Hide the delete confirmation div when "Yes" or "Cancel" is clicked
    deleteYesButton.addEventListener('click', () => {
        deleteProjectDiv.style.display = 'none';
        hideModal();
    });
 
    deleteNoButton.addEventListener('click', () => {
        deleteProjectDiv.style.display = 'none';
        hideModal();
    });
 
    // Function to show the appropriate user table based on button click
    function showUserTable(table: HTMLElement) {
        registeredUsersTable.style.display = 'none';
        assignedUsersTable.style.display = 'none';
        unassignedUsersTable.style.display = 'none';
        table.style.display = 'block';
    }
 
    // Add event listeners to user buttons
    userButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === 'All Registered Users') {
                showUserTable(registeredUsersTable);
            } else if (button.textContent === 'Assigned') {
                showUserTable(assignedUsersTable);
            } else if (button.textContent === 'Unassigned') {
                showUserTable(unassignedUsersTable);
            }
        });
    });
 
    // Show the registered users table by default
    showUserTable(registeredUsersTable);
 
} else {
    console.error('Container element not found');
}