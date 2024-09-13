import { Inject, Injectable } from '@nestjs/common';
import { ICredentialCreatorFacade } from './icredential.facade';
import { VerifiedEthereumEip712Signature2021 } from '../../../domain/entities/eip712';
import { ISubjectResolver, SUBJECT_RESOLVER } from './subjects-resolvers/isubject.resolver';
import { CredentialCallbackRequest } from './credential.callback.request';
import { CredentialCallbackResponse } from './credential.callback.response';

@Injectable()
export class CredentialCreatorFacade implements ICredentialCreatorFacade {

  constructor(
    @Inject(SUBJECT_RESOLVER)
    private subjectResolver: ISubjectResolver,
  ) {
  }

  getResolver<T>(credentialName: string) {
    for(const resolver of this.subjectResolver.getSubjectResolvers()){
      if(resolver.getCredentialName() === credentialName){
        return resolver;
      }
    }
    throw new Error(`No resolver found for ${credentialName}`);
  }

  async getAuthUrl(credentialName: string): Promise<string> {
    return this.getResolver(credentialName).getAuthUrl();
  }

  async callback(credentialCallbackRequest: CredentialCallbackRequest): Promise<CredentialCallbackResponse> {
    return await this.getResolver(credentialCallbackRequest.credentialName).callback(credentialCallbackRequest.callbackData);
  }
}
