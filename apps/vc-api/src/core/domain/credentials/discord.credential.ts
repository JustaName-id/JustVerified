import { CredentialSubjectValue } from '../entities/ethereumEip712Signature';

export interface DiscordCredential extends CredentialSubjectValue{
  username: string;
}
