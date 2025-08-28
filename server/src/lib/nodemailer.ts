import nodemailer from 'nodemailer';




export const sendMail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to,
        subject,
        html: text,
    };

    const info = await transporter.sendMail(mailOptions);

    return info.response;
} 