import { CredentialSubjectValue } from '../entities/eip712';

export interface TelegramCredential extends CredentialSubjectValue{
  username: string;
}
