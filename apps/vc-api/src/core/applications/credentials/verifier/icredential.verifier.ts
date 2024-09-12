import {VerifiedEthereumEip712Signature2021} from "../../../domain/entities/eip712";

export const CREDENTIAL_VERIFIER = 'CREDENTIAL_VERIFIER';

export interface ICredentialVerifier {
  verifyCredential(verifiedEthereumEip712Signature2021: VerifiedEthereumEip712Signature2021): Promise<boolean>;

}
