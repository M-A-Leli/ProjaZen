import '../styles/register.css';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('.register-form') as HTMLFormElement;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = (document.getElementById('email') as HTMLInputElement).value;
        const fname = (document.getElementById('fname') as HTMLInputElement).value;
        const lname = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;
        const termsOfService = (document.getElementById('terms-of-service') as HTMLInputElement);

        clearErrorMessages();

        const validationResult = validateInputs(email, fname, lname, password, confirmPassword, termsOfService);

        if (validationResult.isValid) {
            try {
                const response = await sendDataToAPI({ email, fname, lname, password });
                alert(response.message);

                //! Redirect to the login page upon successful registration
                window.location.href = '../pages/login.html';
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert('An unknown error occurred');
                }
            }
        } else {
            displayErrorMessages(validationResult.errors);
            setTimeout(() => {
                clearErrorMessages();
            }, 3000);
        }
    });
});

interface ValidationResult {
    isValid: boolean;
    message?: string;
    errors?: { field: string, message: string }[];
}

function validateInputs(email: string, fname: string, lname: string, password: string, confirmPassword: string,  checkBox: HTMLInputElement): ValidationResult {
    const errors: { field: string, message: string }[] = [];

    if (!validateEmail(email)) {
        errors.push({ field: 'email', message: 'Email is not valid.' });
    }

    if (!validateName(fname)) {
        errors.push({ field: 'fname', message: 'First is not valid.' });
    }

    if (!validateName(lname)) {
        errors.push({ field: 'fname', message: 'Last is not valid.' });
    }

    if (!validatePassword(password)) {
        errors.push({ field: 'password', message: 'Password must be between 8 and 16 characters and must contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
    }

    if (password !== confirmPassword) {
        errors.push({ field: 'confirm-password', message: 'Passwords do not match.' });
    }

    if(!ValidateAcceptanceOfTerms(checkBox)) {
        errors.push({field: 'terms-of-service', message: 'You need to accept the terms of service'});
    }

    if (errors.length === 0) {
        return { isValid: true, message: "Validation successful." };
    } else {
        return { isValid: false, errors };
    }
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateName(name: string): boolean {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(name);
}

function validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return passwordRegex.test(password);
}

function ValidateAcceptanceOfTerms(checkBox: HTMLInputElement): boolean {
    return checkBox.checked;
}

async function sendDataToAPI(data: { email: string, fname: string, lname: string, password: string }): Promise<{ message: string }> {
    const response = await fetch('http://localhost:3000/api/v1/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.log(response);
        throw new Error('Failed to register');
    }

    return response.json();
}

function clearErrorMessages(): void {
    const errorFields = document.querySelectorAll('.form-group p');
    errorFields.forEach(errorField => {
        errorField.textContent = '';
    });
}

function displayErrorMessages(errors?: { field: string; message: string }[]): void {
    if (errors) {
        errors.forEach(error => {
            const errorField = document.getElementById(`error-${error.field}`);
            if (errorField) {
                errorField.textContent = error.message;
            }
        });
    }
}


