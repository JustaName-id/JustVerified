export class CredentialsException extends Error {
  constructor(message: string) {
    super(message);
  }

  static invalid() {
    return new CredentialsException('Invalid data: Authentication failed');
  }
}