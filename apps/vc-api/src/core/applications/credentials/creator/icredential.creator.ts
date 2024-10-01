import {
  CredentialSubjectValue,
  EthereumEip712Signature2021,
  VerifiableEthereumEip712Signature2021
} from '../../../domain/entities/ethereumEip712Signature';

export const CREDENTIAL_CREATOR = 'CREDENTIAL_CREATOR';

export interface ICredentialCreator {
  createCredential(credential: EthereumEip712Signature2021): Promise<VerifiableEthereumEip712Signature2021>
}
