import { CredentialSubjectValue } from '../entities/ethereumEip712Signature';

export interface TwitterCredential extends CredentialSubjectValue{
  username: string;
}
