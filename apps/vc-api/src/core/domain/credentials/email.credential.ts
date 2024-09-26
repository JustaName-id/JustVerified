import { CredentialSubjectValue } from '../entities/eip712';

export interface EmailCredential extends CredentialSubjectValue{
  email: string;
}
