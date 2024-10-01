import { VerifiableEthereumEip712Signature2021 } from '../../../domain/entities/ethereumEip712Signature';

export class CredentialCallbackResponse {
  dataKey: string;
  verifiableCredential: VerifiableEthereumEip712Signature2021;
  authId: string;
}
