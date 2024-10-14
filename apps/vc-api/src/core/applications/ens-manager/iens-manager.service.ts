import { SignInRequest } from './requests/sign-in.request';
import { SignInResponse } from './responses/sign-in.response';
import { GetRecordsRequest } from './requests/get-records.request';
import { GetRecordsResponse } from './responses/get-records.response';
import { VerifiableEthereumEip712Signature2021 } from '../../domain/entities/ethereumEip712Signature';
import { ChainId } from '../../domain/entities/environment';

export const ENS_MANAGER_SERVICE = 'ENS_MANAGER_SERVICE'

export interface IEnsManagerService {
  signIn(params: SignInRequest): Promise<SignInResponse>
  generateNonce(): string;
  getRecords(params: GetRecordsRequest): Promise<GetRecordsResponse>
  checkIfMAppEnabled(ens: string, chainId: ChainId): Promise<boolean>
  appendVcInMAppEnabledEns(ens: string, chainId: ChainId, vc: VerifiableEthereumEip712Signature2021, field: string): Promise<boolean>
}
