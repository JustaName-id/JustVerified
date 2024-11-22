export class Web3ProviderException extends Error {
    private constructor(message: string) {
      super(message);
    }
  
    static withMessage(providerUrl: string): Web3ProviderException {
      const message = `Web3ProviderException: Provider Url ${providerUrl} threw an error`;
      return new Web3ProviderException(message);
    }
  }