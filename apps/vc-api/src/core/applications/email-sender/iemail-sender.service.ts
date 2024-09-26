import { EmailNotification } from '../../domain/entities/emailNotification';

export const EMAIL_SENDER = 'EMAIL_SENDER';

export interface IEmailSender {
  sendEmail(emailNotification: EmailNotification): Promise<void>;
}
