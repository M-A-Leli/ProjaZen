import '../styles/adminDashboard.css';

// Select all sidebar items and sections
const sidebarItems = document.querySelectorAll('.sidebar div');
const sections = document.querySelectorAll('.section');
const createProjectButton = document.querySelector('.create-project-button button') as HTMLButtonElement;
const projectForm = document.querySelector('.project-form') as HTMLElement;
const projectFormSubmitButton = document.querySelector('.project-form button[type="submit"]') as HTMLButtonElement;
const container = document.querySelector('.container') as HTMLElement | null;
const updateProjectButtons = document.querySelectorAll('#update-project-button') as NodeListOf<HTMLButtonElement>;
const updateForm = document.querySelector('.update-form') as HTMLElement;

if (container) {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    document.body.appendChild(modalOverlay);
    modalOverlay.appendChild(projectForm);
    modalOverlay.appendChild(updateForm);

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

    // Hide the project creation form and update form by default
    projectForm.style.display = 'none';
    updateForm.style.display = 'none';

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
    projectForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from actually submitting
        projectForm.style.display = 'none';
        hideModal();
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
} else {
    console.error('Container element not found');
}
