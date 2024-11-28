import {
  CredentialSubjectValue,
  EthereumEip712Signature2021,
  VerifiableEthereumEip712Signature2021
} from '../../../domain/entities/ethereumEip712Signature';
import { ChainId } from '../../../domain/entities/environment';

export const CREDENTIAL_CREATOR = 'CREDENTIAL_CREATOR';

export interface ICredentialCreator {
  createCredential(credential: EthereumEip712Signature2021, chainId: ChainId): Promise<VerifiableEthereumEip712Signature2021>
  verifyCredential(credential: VerifiableEthereumEip712Signature2021, chainId: ChainId): Promise<boolean>
}
