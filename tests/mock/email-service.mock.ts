import { EmailService } from '../../src/modules/notifications/application/email.service';

export class EmailServiceMock extends EmailService{
  async sendConfirmEmail(email: string, confirmationCode: string): Promise<void> {
    console.log('Sending email mock service');
    return
  }
}