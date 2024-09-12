import { CredentialSubjectValue } from '../entities/eip712';

export interface DiscordCredential extends CredentialSubjectValue{
  username: string;
}
