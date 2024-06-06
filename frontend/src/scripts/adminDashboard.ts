import '../styles/adminDashboard.css';

interface Project {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
}

// Select all sidebar items and sections
const sidebarItems = document.querySelectorAll('.sidebar div');
const sections = document.querySelectorAll('.section');
const createProjectButton = document.querySelector('.create-project-button button') as HTMLButtonElement;
const projectForm = document.querySelector('.project-form form') as HTMLFormElement;
const container = document.querySelector('.container') as HTMLElement | null;
const updateProjectButtons = document.querySelectorAll('#update-project-button') as NodeListOf<HTMLButtonElement>;
const deleteProjectButtons = document.querySelectorAll('#delete-project-button') as NodeListOf<HTMLButtonElement>;
const updateForm = document.querySelector('.update-form') as HTMLElement;
const deleteProjectDiv = document.querySelector('.delete-project') as HTMLElement;
const deleteYesButton = document.getElementById('yes') as HTMLButtonElement;
const deleteNoButton = document.getElementById('no') as HTMLButtonElement;

const userButtons = document.querySelectorAll('.user-buttons button');
const registeredUsersTable = document.querySelector('.registered-users') as HTMLElement;
const assignedUsersTable = document.querySelector('.assigned-users') as HTMLElement;
const unassignedUsersTable = document.querySelector('.unassigned-users') as HTMLElement;

const projectName = document.getElementById("project-name") as HTMLInputElement;
const projectDescription = document.getElementById("text-area") as HTMLTextAreaElement;
const projectStartDate = document.getElementById("start-date") as HTMLInputElement;
const projectEndDate = document.getElementById("end-date") as HTMLInputElement;

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

    // Show the project creation form when the "Create New Project" button is clicked
    createProjectButton.addEventListener('click', () => {
        projectForm.style.display = 'block';
        updateForm.style.display = 'none'; // Ensure the update form is hidden
        showModal();
    });

    // Hide the project creation form when the form is submitted
    projectForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from actually submitting

        // Collect form data
        // const formData = new FormData(projectForm);a
        const project: Project = {
            name: projectName.value,
            description: projectDescription.value,
            startDate: projectStartDate.value,
            endDate: projectEndDate.value,
        };

        // Save the project data to the db.json file (simulate API call)
        await fetch('http://localhost:3000/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        });

        projectForm.reset(); // Reset the form
        projectForm.style.display = 'none';
        hideModal();

        // Fetch and display the updated list of projects
        displayProjects();
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

    // Function to fetch and display projects
    async function displayProjects() {
        const response = await fetch('http://localhost:3000/projects');
        const projects: Project[] = await response.json();

        const projectsList = document.querySelector('.projects-list') as HTMLElement;
        projectsList.innerHTML = '';

        projects.forEach((project) => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <p>Start Date: ${project.startDate}</p>
                <p>End Date: ${project.endDate}</p>
                <button class ="button1 ">assign the project</button>
            `;
            projectsList.appendChild(projectCard);
        });
    }

    // Fetch and display projects on load
    displayProjects();

} else {
    console.error('Container element not found');
}