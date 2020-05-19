/* eslint-disable no-console */
import nodemailer from 'nodemailer';

class SendMailService {
  public async execute(html: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_NODEMAILER_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'Alerta de invasão - Cloudcom',
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log({
          message: 'Email enviado',
          info: info.response,
        });
      }
    });
  }
}

export default SendMailService;
