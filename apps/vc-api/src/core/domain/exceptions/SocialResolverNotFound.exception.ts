export class SocialResolverNotFoundException extends Error {
  constructor(message: string) {
    super(message);
  }

  static forCredentialName(credentialName: string) {
    const message = `No resolver found for ${credentialName}`;
    return new SocialResolverNotFoundException(message);
  }
}
