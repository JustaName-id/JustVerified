import { VerifiedEthereumEip712Signature2021 } from '../../../domain/entities/eip712';

export class CredentialCallbackResponse {
  dataKey: string;
  verifiableCredential: VerifiedEthereumEip712Signature2021;
  authId: string;
}
