import { EmailService } from '../../src/modules/notifications/application/email.service';

export class EmailServiceMock extends EmailService{
  async sendConfirmEmail(email: string, confirmationCode: string): Promise<void> {
  }
}