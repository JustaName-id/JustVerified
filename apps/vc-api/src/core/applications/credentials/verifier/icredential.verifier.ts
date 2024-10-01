import {VerifiableEthereumEip712Signature2021} from "../../../domain/entities/ethereumEip712Signature";

export const CREDENTIAL_VERIFIER = 'CREDENTIAL_VERIFIER';

export interface ICredentialVerifier {
  verifyCredential(verifiedEthereumEip712Signature2021: VerifiableEthereumEip712Signature2021): Promise<boolean>;
}
