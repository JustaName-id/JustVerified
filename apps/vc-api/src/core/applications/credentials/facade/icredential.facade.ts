import {AbstractSubjectResolver} from "./subjects-resolvers/subjects/abstract.subject.resolver";
import { CredentialCallbackRequest } from './credential.callback.request';
import { CredentialCallbackResponse } from './credential.callback.response';

export const CREDENTIAL_CREATOR_FACADE = 'CREDENTIAL_CREATOR_FACADE';

export interface ICredentialCreatorFacade {
  getResolver<T>(credentialName: string): AbstractSubjectResolver<T>  ;
  getAuthUrl(credentialName: string, subname: string, sessionId: string): Promise<string>;
  callback(credentialCallbackRequest: CredentialCallbackRequest): Promise<CredentialCallbackResponse>;
}
