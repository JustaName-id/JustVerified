export class ChainIdInvalidException extends Error {
  constructor(message: string) {
    super(message);
  }

  static withId(chainId: number) {
    const message = `Chain ID ${chainId} is invalid.`;
    return new ChainIdInvalidException(message);
  }
}