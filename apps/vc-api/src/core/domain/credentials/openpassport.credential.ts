import { CredentialSubjectValue } from '../entities/ethereumEip712Signature';

// TODO: fix this type
export interface OpenPassportCredential extends CredentialSubjectValue {
    dsc: any;
    dscProof: any;
    proof: any;
}