import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, confirmationCode: string) {
    const message = `
      <h1>Thanks for registration</h1>
      <p>To finish registration please follow the link below:</p>
      <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>ЖМАК!!!</a>
      <p>Complete registration</p>
    `;

    await this.sendEmail(email, 'Email confirmation', message);
  }
  async sendEmail(to: string, subject: string, html: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }

}
