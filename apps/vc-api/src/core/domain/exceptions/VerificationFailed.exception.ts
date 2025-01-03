export class VerificationFailedException extends Error {
    constructor(message: string) {
      super(message);
    }
  
    static openPassportVerificationFailed() {
      return new VerificationFailedException('OpenPassport verification failed');
    }
  }
  