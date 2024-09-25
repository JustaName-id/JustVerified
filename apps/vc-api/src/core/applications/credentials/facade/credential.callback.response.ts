import { VerifiableEthereumEip712Signature2021 } from '../../../domain/entities/eip712';

export class CredentialCallbackResponse {
  dataKey: string;
  verifiableCredential: VerifiableEthereumEip712Signature2021;
  authId: string;
}
