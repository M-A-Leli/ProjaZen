import * as ejs from 'ejs';
import * as path from 'path';

export interface IEmailTemplate {
    subject: string;
    templateName: string;
}

export class EmailTemplate implements IEmailTemplate {
    subject: string;
    templateName: string;

    constructor(subject: string, templateName: string) {
        this.subject = subject;
        this.templateName = templateName;
    }

    async renderTemplate(data: Record<string, any>): Promise<string> {
        const templatePath = path.join(__dirname, '..', 'templates', `${this.templateName}.ejs`);
        return ejs.renderFile(templatePath, data);
    }
}
