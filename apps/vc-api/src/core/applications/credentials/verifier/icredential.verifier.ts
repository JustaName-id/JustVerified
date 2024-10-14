import {VerifiableEthereumEip712Signature2021} from "../../../domain/entities/ethereumEip712Signature";
import { ChainId } from '../../../domain/entities/environment';

export const CREDENTIAL_VERIFIER = 'CREDENTIAL_VERIFIER';

export interface ICredentialVerifier {
  verifyCredential(verifiedEthereumEip712Signature2021: VerifiableEthereumEip712Signature2021, chainId: ChainId): Promise<boolean>;
}
