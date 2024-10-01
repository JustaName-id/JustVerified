import { BaseSocialCallback } from './social-credential-resolver/social-resolver/callback/base.social.callback';

export class CredentialCallbackRequest {
  credentialName: string;
  callbackData: BaseSocialCallback
}
