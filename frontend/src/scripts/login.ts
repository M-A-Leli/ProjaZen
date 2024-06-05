import '../styles/login.css';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const errorContainer = document.getElementById('errorContainer') as HTMLDivElement;

    const emailError = document.getElementById('email-error') as HTMLParagraphElement;
    const passwordError = document.getElementById('password-error') as HTMLParagraphElement;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        let validationPassed = true;

        // Clear previous validation error messages
        emailError.textContent = '';
        passwordError.textContent = '';
        errorContainer.textContent = '';

        // Validate email format
        if (!validateEmail(email)) {
            emailError.textContent = 'Invalid email address';
            validationPassed = false;
            clearErrorsAfterDelay();
        }

        // Validate password format
        if (!validatePassword(password)) {
            passwordError.textContent = 'Password must be at least 8 characters long and contain a mixture of numbers, letters, and special characters';
            validationPassed = false;
            clearErrorsAfterDelay();
        }

        if (!validationPassed) return;

        // If all validations pass, send data to API endpoint
        try {
            await sendLoginData(email, password);
        } catch (error) {
            if (error instanceof Error) {
                errorContainer.textContent = error.message;
            } else {
                errorContainer.textContent = 'An unknown error occurred';
            }
            clearErrorsAfterDelay();
        }
    });

    function validateEmail(email: string): boolean {
        // Basic email format validation using regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password: string): boolean {
        // Password validation: at least 8 characters long and contains a mixture of numbers, letters, and special characters
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
        return passwordRegex.test(password);
    }

    async function sendLoginData(email: string, password: string): Promise<void> {
        const apiUrl = 'http://localhost:3000/api/v1/auth/login';
        const requestData = {
            email,
            password
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                // Handle server-side errors
                const errorData = await response.json();
                if (errorData && errorData.errors) {
                    // If errors are present, display them
                    displayErrors(errorData.errors);
                } else if (errorData) {
                    // If not an array of errors objects
                    throw new Error(errorData.error);
                } else {
                    // If no specific errors provided, display generic error message
                    throw new Error('Failed to login');
                }
            } else {
                // Clear input fields
                resetFields();

                // Clear any previous error messages
                errorContainer.textContent = '';

                const responseData = await response.json();
                const { token, userId } = responseData;

                // Check if response contains an access token
                if (!token) {
                    throw new Error('Access token not found');
                }

                // Save token and userid to localStorage or sessionStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);

                //! Redirect to dashboard after successful login
                window.location.href = '../pages/dashboard.html';
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }

    // Function to display errors
    function displayErrors(errors: { msg: string }[]): void {
        // Clear previous error messages
        errorContainer.innerHTML = '';

        // Create an unordered list to display errors
        const errorList = document.createElement('ul');

        // Iterate over the array of errors
        errors.forEach(error => {
            // Extract the "msg" value from each error object
            const errorMessageText = error.msg;

            // Create list item for each error message
            const listItem = document.createElement('li');
            listItem.textContent = errorMessageText;

            // Append list item to the unordered list
            errorList.appendChild(listItem);
        });

        // Append the unordered list to the error container
        errorContainer.appendChild(errorList);
    }

    function resetFields(): void {
        const emailField = document.getElementById('email') as HTMLInputElement;
        const passwordField = document.getElementById('password') as HTMLInputElement;

        emailField.value = '';
        passwordField.value = '';
    }

    function clearErrorsAfterDelay() {
        setTimeout(() => {
            emailError.textContent = '';
            passwordError.textContent = '';
            errorContainer.textContent = '';
        }, 3000);
    }
    
});

