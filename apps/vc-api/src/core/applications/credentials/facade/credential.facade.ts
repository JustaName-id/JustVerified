import {Inject, Injectable} from "@nestjs/common";
import {ICredentialCreatorFacade} from "./icredential.facade";
import {VerifiedEthereumEip712Signature2021} from "../../../domain/entities/eip712";
import {ICredentialFacadeRequest} from "./icredential.facade.request";
import {ISubjectResolver, SUBJECT_RESOLVER} from "./subjects-resolvers/isubject.resolver";

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

  async callback<T>(credentialName: string, body: T): Promise<void> {
    return this.getResolver<T>(credentialName).callback(body);
  }
}
