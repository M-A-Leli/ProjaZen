import { AssignmentCreatedTemplate, AssignmentDeletedTemplate, ProjectCompletedTemplate } from '../models/SpecificEmailTemplates';
import { sendEmail } from '../utils/EmailUtil';

export async function sendAssignmentCreatedEmail(to: string, data: Record<string, any>): Promise<void> {
    const template = new AssignmentCreatedTemplate();
    const html = await template.renderTemplate(data);
    await sendEmail(to, template.subject, html);
}

export async function sendAssignmentDeletedEmail(to: string, data: Record<string, any>): Promise<void> {
    const template = new AssignmentDeletedTemplate();
    const html = await template.renderTemplate(data);
    await sendEmail(to, template.subject, html);
}

export async function sendProjectCompletedEmail(to: string, data: Record<string, any>): Promise<void> {
    const template = new ProjectCompletedTemplate();
    const html = await template.renderTemplate(data);
    await sendEmail(to, template.subject, html);
}
