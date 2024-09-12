import {AbstractSubjectResolver} from "./subjects-resolvers/subjects/abstract.subject.resolver";
import { AllCallback } from './subjects-resolvers/subjects/callback/all.callback';

export const CREDENTIAL_CREATOR_FACADE = 'CREDENTIAL_CREATOR_FACADE';

export interface ICredentialCreatorFacade {
  getResolver<T>(credentialName: string): AbstractSubjectResolver<T>  ;
  getAuthUrl(credentialName: string): Promise<string>;
  callback(credentialName: string,code: AllCallback): Promise<void>;
}
