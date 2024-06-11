import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PSW,
    },
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
        from: process.env.EMAIL_SERVICE,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
}
