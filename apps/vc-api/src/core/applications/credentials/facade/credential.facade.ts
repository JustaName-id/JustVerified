import { Inject, Injectable } from '@nestjs/common';
import { ICredentialCreatorFacade } from './icredential.facade';
import { VerifiableEthereumEip712Signature2021 } from '../../../domain/entities/eip712';
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

  async getAuthUrl(credentialName: string, ens: string, authId: string): Promise<string> {
    return this.getResolver(credentialName).getAuthUrl({ens, authId});
  }

  async callback(credentialCallbackRequest: CredentialCallbackRequest): Promise<CredentialCallbackResponse> {
    return await this.getResolver(credentialCallbackRequest.credentialName).callback(credentialCallbackRequest.callbackData);
  }
}
