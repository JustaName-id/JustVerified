import { VerifiedEthereumEip712Signature2021 } from '../../core/domain/entities/eip712';

export interface SubjectData {
  authId: string;
  result: {
    verifiableCredential: VerifiedEthereumEip712Signature2021;
    dataKey: string;
  };
}
