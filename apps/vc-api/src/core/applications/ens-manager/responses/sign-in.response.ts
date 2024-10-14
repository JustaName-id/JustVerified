import { ChainId } from '../../../domain/entities/environment';

export class SignInResponse {
  address: string
  ens: string
  chainId: ChainId
}
