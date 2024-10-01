import {CredentialSubjectValue} from "../entities/ethereumEip712Signature";

export interface EmailCredential extends CredentialSubjectValue{
  email: string;
}
