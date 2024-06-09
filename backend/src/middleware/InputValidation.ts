import { Response, Request, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

function validateUUID(id: string) {
    return param(id)
        .notEmpty().withMessage('ID should not be empty')
        .isUUID().withMessage('ID should be a valid UUID string');
}

function validateFirstName() {
    return body('fname')
        .notEmpty().withMessage('First name is required')
        .matches(/^[A-Za-z]+$/).withMessage('First name should contain only letters and no whitespaces');
}

function validateLastName() {
    return body('lname')
        .notEmpty().withMessage('Last name is required')
        .matches(/^[A-Za-z]+$/).withMessage('Last name should contain only letters and no whitespaces');
}

function validateEmail() {
    return body('email')
        .isEmail().withMessage('Must be a valid email')
        .isLength({ max: 100 }).withMessage('Email cannot exceed 100 characters');
}

function validatePassword() {
    return body('password')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
}

function validateNotificationMessage() {
    return body('message')
        .isLength({ min: 50, max: 150 }).withMessage('Notification message must be between 50 and 150 characters long')
        .isString().withMessage('Notification message must be a string');
}

function validateProjectName() {
    return body('name')
        .isLength({ max: 30 }).withMessage('Project name must be at most 30 characters long')
        .matches(/^[\w\s]+$/).withMessage('Project name can only contain letters, numbers, and spaces');
}

function validateProjectDescription() {
    return body('description')
        .optional()
        .isLength({ max: 300 }).withMessage('Project description cannot exceed 300 characters')
        .matches(/^[\w\s.,!?]+$/).withMessage('Project description can only contain normal text and punctuation');
}

function validateProjectStatus() {
    return body('status')
        .isIn(['unassigned', 'assigned', 'completed']).withMessage('Project status must be one of: unassigned, assigned, completed');
}

function validateDate(field: string) {
    return body(field)
        .isDate().withMessage(`${field} must be a valid date`);
}

function validateFutureDate(field: string) {
    return body(field)
        .isDate().withMessage(`${field} must be a valid date`)
        .custom((value: string) => {
            const currentDate = new Date();
            const inputDate = new Date(value);
            if (inputDate < currentDate) {
                throw new Error(`${field} must be today or in the future`);
            }
            return true;
        });
}

// Function to validate user creation
function validateLoginInput() {
    return [
        validateEmail(),
        validatePassword(),
        handleValidationErrors
    ];
}

// Function to validate user creation
function validateUserCreation() {
    return [
        validateFirstName(),
        validateLastName(),
        validateEmail(),
        validatePassword(),
        handleValidationErrors
    ];
}

// Function to validate user update
function validateUserUpdate() {
    return [
        validateFirstName(),
        validateLastName(),
        validateEmail(),
        handleValidationErrors
    ];
}

// Function to validate project creation
function validateProjectCreation() {
    return [
        validateProjectName(),
        validateProjectDescription(),
        validateProjectStatus(),
        validateFutureDate('startDate'),
        validateFutureDate('endDate'),
        handleValidationErrors
    ];
}

// Function to validate project update
function validateProjectUpdate() {
    return [
        validateProjectName(),
        validateProjectDescription(),
        validateProjectStatus(),
        validateDate('startDate'),
        validateFutureDate('endDate'),
        handleValidationErrors
    ];
}

// Function to validate notification creation
function validateNotificationCreation() {
    return [
        validateNotificationMessage(),
        handleValidationErrors
    ];
}

// Function to validate notification update
function validateNotificationUpdate() {
    return [
        validateNotificationMessage(),
        handleValidationErrors
    ];
}

function handleValidationErrors(req: Response, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export {
    validateUUID,
    validateFirstName,
    validateLastName,
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
    validateNotificationUpdate,
    handleValidationErrors
}
