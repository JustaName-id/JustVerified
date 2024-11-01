export class CredentialsException extends Error {
  constructor(message: string) {
    super(message);
  }

  static invalid() {
    return new CredentialsException('CredentialsException: Authentication failed');
  }
}
