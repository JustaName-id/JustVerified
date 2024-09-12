import { CredentialSubjectValue } from '../entities/eip712';

export interface TwitterCredential extends CredentialSubjectValue{
  username: string;
}
