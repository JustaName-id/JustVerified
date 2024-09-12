import { CredentialSubjectValue } from '../entities/eip712';

export interface GithubCredential extends CredentialSubjectValue{
  username: string;
}
