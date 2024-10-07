export class AuthenticationException extends Error {
  constructor(message: string) {
    super(message);
  }

  static withError(error: unknown) {
    if (error instanceof Error) {
      return new AuthenticationException(error.message);
    }
    return new AuthenticationException('Authentication failed.');
  }
}
