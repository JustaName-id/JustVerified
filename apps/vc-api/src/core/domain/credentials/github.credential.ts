import { CredentialSubjectValue } from '../entities/ethereumEip712Signature';

export interface GithubCredential extends CredentialSubjectValue{
  username: string;
}
