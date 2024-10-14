import { ChainId } from '../../../../../domain/entities/environment';

export interface EmailOtpGenerateRequest {
  email: string;
  authId: string;
  ens: string;
  chainId: ChainId
}
