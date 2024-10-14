export class AuthenticationException extends Error {
  constructor(message: string) {
    super(message);
  }

  static withError(error: Error) {
      return new AuthenticationException(error.message);
  }
}
