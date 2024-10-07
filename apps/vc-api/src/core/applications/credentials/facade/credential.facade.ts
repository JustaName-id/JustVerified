import { Inject, Injectable } from '@nestjs/common';
import { ICredentialCreatorFacade } from './icredential.facade';
import { VerifiableEthereumEip712Signature2021 } from '../../../domain/entities/ethereumEip712Signature';
import { ISocialCredentialResolver, SOCIAL_CREDENTIAL_RESOLVER } from './social-credential-resolver/isocial.credential.resolver';
import { CredentialCallbackRequest } from './credential.callback.request';
import { CredentialCallbackResponse } from './credential.callback.response';
import {EmailResolver} from "./email-resolver/email.resolver";
import {EMAIL_RESOLVER, IEmailResolver} from "./email-resolver/iemail.resolver";
import {EmailCallback} from "./email-resolver/email.callback";
import { SocialResolverNotFoundException } from '../../../domain/exceptions/SocialResolverNotFound.exception';

@Injectable()
export class CredentialCreatorFacade implements ICredentialCreatorFacade {

  constructor(
    @Inject(SOCIAL_CREDENTIAL_RESOLVER)
    private subjectResolver: ISocialCredentialResolver,

    @Inject(EMAIL_RESOLVER)
    private readonly emailResolver: IEmailResolver,

  ) {}

  getSocialResolver<T>(credentialName: string) {
    for(const resolver of this.subjectResolver.getSocialResolvers()){
      if(resolver.getCredentialName() === credentialName){
        return resolver;
      }
    }
    throw SocialResolverNotFoundException.forCredentialName(credentialName);
  }

  async getSocialAuthUrl(credentialName: string, ens: string, authId: string): Promise<string> {
    return this.getSocialResolver(credentialName).getAuthUrl({ens, authId});
  }

  async socialCallback(credentialCallbackRequest: CredentialCallbackRequest): Promise<CredentialCallbackResponse> {
    return await this.getSocialResolver(credentialCallbackRequest.credentialName).generateCredential(credentialCallbackRequest.callbackData);
  }

  async getEmailOTP(email: string, ens: string, authId:string): Promise<string> {
    const state = await this.emailResolver.generateEmailOtp({email, authId, ens})
    return state.state
  }

  async resendOtp(state: string): Promise<void> {
    return this.emailResolver.resendOtp(state)
  }

  callbackEmailOTP(callbackData: EmailCallback): Promise<CredentialCallbackResponse> {
     return this.emailResolver.generateCredential(callbackData)
  }

  clearState(state: string): string {
    return this.emailResolver.clearState(state)
  }
}
