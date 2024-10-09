export class JustaNameInitializerException extends Error {
  constructor(message: string) {
    super(message);
  }

  static withError(error: unknown) {
    if (error instanceof Error) {
      return new JustaNameInitializerException(error.message);
    }
    return new JustaNameInitializerException(
      'An error has occurred.'
    );
  }
}
