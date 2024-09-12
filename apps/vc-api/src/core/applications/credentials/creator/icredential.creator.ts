import {
  CredentialSubjectValue,
  EthereumEip712Signature2021,
  VerifiedEthereumEip712Signature2021
} from '../../../domain/entities/eip712';

export const CREDENTIAL_CREATOR = 'CREDENTIAL_CREATOR';

export interface ICredentialCreator {
  createCredential(credential: EthereumEip712Signature2021): Promise<VerifiedEthereumEip712Signature2021>
}
