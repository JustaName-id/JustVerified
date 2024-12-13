export class CredentialsException extends Error {
  constructor(message: string) {
    super(message);
  }

  static invalid() {
    return new CredentialsException('CredentialsException: Authentication failed');
  }

  static addressMismatch() {
    return new CredentialsException('Address from records does not match address from attestation');
  }
}
