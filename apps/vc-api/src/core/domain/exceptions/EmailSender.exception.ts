export class EmailSenderException extends Error {
  constructor(message: string) {
    super(message);
  }

  static withEmail(email: string, message: string) {
    const errorMessage = `Error while sending email for Email Verification ${email}. ${message}`;
    return new EmailSenderException(errorMessage);
  }
}
