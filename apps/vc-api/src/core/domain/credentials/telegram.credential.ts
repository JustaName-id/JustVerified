import { CredentialSubjectValue } from '../entities/ethereumEip712Signature';

export interface TelegramCredential extends CredentialSubjectValue{
  username: string;
}
