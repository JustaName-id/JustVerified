export class CredentialsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CredentialsException';
  }

  static invalid() {
    return new CredentialsException('Invalid data: Authentication failed');
  }
}