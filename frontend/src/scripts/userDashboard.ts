import '../styles/userDashboard.css';

document.addEventListener('DOMContentLoaded', () => {
    const registerDiv = document.getElementById('nav-register');
    const projectFormDiv = document.querySelector('.projects-block') as HTMLElement;
    const projectForm = document.getElementById('project-form') as HTMLFormElement;
    const projectsTableDiv = document.querySelector('.projects-table') as HTMLElement;
    const projectsTableBody = document.querySelector('#projects-table tbody') as HTMLTableSectionElement;
    const welcomeDiv = document.querySelector('.welcome') as HTMLElement;

    if (registerDiv && projectFormDiv && welcomeDiv) {
        registerDiv.addEventListener('click', () => {
            // Hide welcome section and show project form
            welcomeDiv.style.display = 'none';
            projectFormDiv.style.display = 'block';
        });
    }

    if (projectForm) {
        projectForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const projectName = (document.getElementById('project-name') as HTMLInputElement).value;
            const projectDescription = (document.getElementById('project-description') as HTMLTextAreaElement).value;
            const startDate = (document.getElementById('start-date') as HTMLInputElement).value;
            const endDate = (document.getElementById('end-date') as HTMLInputElement).value;

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${projectName}</td>
                <td>${projectDescription}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>Pending</td>
            `;

            projectsTableBody.appendChild(newRow);
            
            // Hide project form and show projects table
            projectFormDiv.style.display = 'none';
            projectsTableDiv.style.display = 'block';

            projectForm.reset();
        });
    }
});

