import '../styles/register.css';

class RegisterFormHandler {
    private form!: HTMLFormElement;

    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            this.form = document.getElementById('register-form') as HTMLFormElement;
            this.initializeEventListeners();
            console.log(this.validatePassword("Aa1@aaaa"));
        });
    }

    private initializeEventListeners(): void {
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault(); // Prevent form from refreshing the page

        const email = (document.getElementById('email') as HTMLInputElement).value;
        const fname = (document.getElementById('fname') as HTMLInputElement).value;
        const lname = (document.getElementById('lname') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;
        const termsOfService = (document.getElementById('terms-of-service') as HTMLInputElement);

        this.clearErrorMessages();

        const validationResult = this.validateInputs(email, fname, lname, password, confirmPassword, termsOfService);

        if (validationResult.isValid) {
            try {
                const response = await this.sendDataToAPI({ email, fname, lname, password });
                alert(response.message);

                // Redirect to the login page upon successful registration
                window.location.href = '../pages/login.html';
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert('An unknown error occurred');
                }
            }
        } else {
            this.displayErrorMessages(validationResult.errors);
            setTimeout(() => {
                this.clearErrorMessages();
            }, 3000);
        }
    }

    private validateInputs(email: string, fname: string, lname: string, password: string, confirmPassword: string, checkBox: HTMLInputElement): ValidationResult {
        const errors: { field: string, message: string }[] = [];

        if (!this.validateEmail(email)) {
            errors.push({ field: 'email', message: 'Email is not valid.' });
        }

        if (!this.validateName(fname)) {
            errors.push({ field: 'fname', message: 'First name is not valid.' });
        }

        if (!this.validateName(lname)) {
            errors.push({ field: 'lname', message: 'Last name is not valid.' });
        }

        if (!this.validatePassword(password)) {
            errors.push({
                field: 'password',
                message: 'Password must be between 8 and 16 characters and must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            });
        }

        if (password !== confirmPassword) {
            errors.push({ field: 'confirm-password', message: 'Passwords do not match.' });
        }

        if (!this.validateAcceptanceOfTerms(checkBox)) {
            errors.push({ field: 'terms-of-service', message: 'You need to accept the terms of service' });
        }

        return errors.length === 0 ? { isValid: true, message: "Validation successful." } : { isValid: false, errors };
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private validateName(name: string): boolean {
        const nameRegex = /^[A-Za-z]+$/;
        return nameRegex.test(name);
    }

    private validatePassword(password: string): boolean {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        return passwordRegex.test(password);
    }

    private validateAcceptanceOfTerms(checkBox: HTMLInputElement): boolean {
        return checkBox.checked;
    }

    private async sendDataToAPI(data: { email: string, fname: string, lname: string, password: string }): Promise<{ message: string }> {
        const response = await fetch('http://localhost:3000/api/v1/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to register');
        }

        return response.json();
    }

    private clearErrorMessages(): void {
        const errorFields = document.querySelectorAll('.form-group p');
        errorFields.forEach(errorField => {
            errorField.textContent = '';
        });
    }

    private displayErrorMessages(errors?: { field: string; message: string }[]): void {
        if (errors) {
            errors.forEach(error => {
                const errorField = document.getElementById(`error-${error.field}`);
                if (errorField) {
                    errorField.textContent = error.message;
                }
            });
        }
    }
}

interface ValidationResult {
    isValid: boolean;
    message?: string;
    errors?: { field: string, message: string }[];
}

new RegisterFormHandler();

