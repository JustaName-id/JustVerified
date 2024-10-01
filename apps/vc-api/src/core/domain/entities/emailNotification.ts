import { EmailNotificationContent } from './emailNotificationContent';

export class EmailNotification {
  to: string;
  subject: string;
  content: EmailNotificationContent;
}
