export class JustaNameInitializerException extends Error {
  constructor(message: string) {
    super(message);
  }

  static withError(error: Error) {
    return new JustaNameInitializerException(error.message);
  }
}
