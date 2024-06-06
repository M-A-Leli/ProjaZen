import '../styles/login.css';

class LoginForm {
    private emailInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;
    private emailError: HTMLParagraphElement;
    private passwordError: HTMLParagraphElement;
    private errorContainer: HTMLDivElement;

    constructor() {
        this.emailInput = document.getElementById("email") as HTMLInputElement;
        this.passwordInput = document.getElementById("password") as HTMLInputElement;
        this.emailError = document.getElementById("email-error") as HTMLParagraphElement;
        this.passwordError = document.getElementById("password-error") as HTMLParagraphElement;
        this.errorContainer = document.getElementById("error-container") as HTMLDivElement;
        this.addEventListeners();
    }

    private addEventListeners() {
        const loginForm = document.getElementById("login-form") as HTMLFormElement;
        loginForm.addEventListener("submit", this.handleSubmit.bind(this));
    }

    private async handleSubmit(event: Event) {
        event.preventDefault();

        this.clearErrors();

        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        if (!this.validateEmail(email)) {
            this.displayError(this.emailError, "Invalid email address.");
            return;
        }

        if (!this.validatePassword(password)) {
            this.displayError(this.passwordError, "Invalid password. It must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be between 8 and 16 characters.");
            return;
        }

        try {
            const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error("An error occurred during login.");
            } else {
                // throw new Error(response.error);
                // console.log(response.body);
            }

            const data = await response.json();
            const { token, redirectUrl } = data;

            // Save token and userid to localStorage or sessionStorage
            localStorage.setItem('token', token);

            console.log(redirectUrl);

            // Redirect to the appropriate dashboard
            window.location.href = redirectUrl;
        } catch (error) {
            // Display a generic error message to the user
            this.displayError(this.errorContainer, "An unexpected error occurred. Please try again later.");
        }
    }

    private clearErrors() {
        this.emailError.textContent = "";
        this.passwordError.textContent = "";
        this.errorContainer.textContent = "";
    }

    private displayError(element: HTMLElement, message: string) {
        element.textContent = message;
    }

    private validateEmail(email: string): boolean {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private validatePassword(password: string): boolean {
        // Password validation regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,16}$/;
        return passwordRegex.test(password);
    }
}

// Instantiate the form object
new LoginForm();
