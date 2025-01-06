import { VerifiableEthereumEip712Signature2021 } from '../../core/domain/entities/ethereumEip712Signature';

export interface SubjectData {
  authId: string;
  heartbeat: boolean
  result?: {
    verifiableCredential: VerifiableEthereumEip712Signature2021;
    dataKey: string;
  };
}
