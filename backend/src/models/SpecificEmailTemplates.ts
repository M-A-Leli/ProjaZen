import { EmailTemplate } from './EmailTemplate';

export class AssignmentCreatedTemplate extends EmailTemplate {
    constructor() {
        super('Project Assignment Notification', 'assignmentCreated');
    }
}

export class AssignmentDeletedTemplate extends EmailTemplate {
    constructor() {
        super('Project Unassignment Notification', 'assignmentDeleted');
    }
}

export class ProjectCompletedTemplate extends EmailTemplate {
    constructor() {
        super('Project Completed Notification', 'projectCompleted');
    }
}
