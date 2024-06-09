function validateFirstName(fname: string): boolean {
    return /^[A-Za-z]+$/.test(fname);
}

function validateLastName(lname: string): boolean {
    return /^[A-Za-z]+$/.test(lname);
}

function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password);
}

function validateNotificationMessage(message: string): boolean {
    return message.length >= 50 && message.length <= 150;
}

function validateProjectName(name: string): boolean {
    return name.length <= 30 && /^[a-zA-Z0-9\s]+$/.test(name);
}

function validateProjectDescription(description: string): boolean {
    return description.length <= 300 && /^[\w\s.,!?]+$/.test(description);
}

function validateProjectStatus(status: string): boolean {
    return ['unassigned', 'assigned', 'completed'].includes(status);
}

function validateDate(date: string): boolean {
    return !isNaN(Date.parse(date));
}

function validateFutureDate(date: string): boolean {
    const currentDate = new Date();
    const inputDate = new Date(date);
    return inputDate > currentDate;
}

// Function to validate user login input
function validateLoginInput(email: string, password: string): boolean {
    return validateEmail(email) && validatePassword(password);
}

// Function to validate user creation
function validateUserCreation(fname: string, lname: string, email: string, password: string): boolean {
    return validateFirstName(fname) && validateLastName(lname) && validateEmail(email) && validatePassword(password);
}

// Function to validate user update
function validateUserUpdate(fname: string, lname: string, email: string): boolean {
    return validateFirstName(fname) && validateLastName(lname) && validateEmail(email);
}

// Function to validate project creation
function validateProjectCreation(name: string, description: string, status: string, startDate: string, endDate: string): boolean {
    return validateProjectName(name) && validateProjectDescription(description) && validateProjectStatus(status) && validateFutureDate(startDate) && validateFutureDate(endDate);
}

// Function to validate project update
function validateProjectUpdate(name: string, description: string, status: string, startDate: string, endDate: string): boolean {
    return validateProjectName(name) && validateProjectDescription(description) && validateProjectStatus(status) && validateDate(startDate) && validateFutureDate(endDate);
}

// Function to validate notification creation
function validateNotificationCreation(message: string): boolean {
    return validateNotificationMessage(message);
}

// Function to validate notification update
function validateNotificationUpdate(message: string): boolean {
    return validateNotificationMessage(message);
}

export {
    validateEmail,
    validatePassword,
    validateNotificationMessage,
    validateProjectName,
    validateProjectDescription,
    validateProjectStatus,
    validateDate,
    validateFutureDate,
    validateLoginInput,
    validateUserCreation,
    validateUserUpdate,
    validateProjectCreation,
    validateProjectUpdate,
    validateNotificationCreation,
    validateNotificationUpdate
};
