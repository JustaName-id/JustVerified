import { VerifiableEthereumEip712Signature2021 } from '../../core/domain/entities/eip712';

export interface SubjectData {
  authId: string;
  result: {
    verifiableCredential: VerifiableEthereumEip712Signature2021;
    dataKey: string;
  };
}
