import {AbstractSocialResolver} from "./social-credential-resolver/social-resolver/abstract.social.resolver";
import { CredentialCallbackRequest } from './credential.callback.request';
import { CredentialCallbackResponse } from './credential.callback.response';
import {EmailCallback} from "./email-resolver/email.callback";
import { ChainId } from '../../../domain/entities/environment';

export const CREDENTIAL_CREATOR_FACADE = 'CREDENTIAL_CREATOR_FACADE';

export interface ICredentialCreatorFacade {
  getSocialResolver(credentialName: string): AbstractSocialResolver  ;
  getSocialAuthUrl(credentialName: string, ens: string, chainId: ChainId, authId: string): Promise<string>;
  socialCallback(credentialCallbackRequest: CredentialCallbackRequest): Promise<CredentialCallbackResponse>;
  getEmailOTP(email: string, ens: string, chainId: ChainId, authId:string): Promise<string>;
  resendOtp(state: string): Promise<void>;
  callbackEmailOTP(callbackData: EmailCallback ): Promise<CredentialCallbackResponse>;
  clearState(state: string): string;
}
