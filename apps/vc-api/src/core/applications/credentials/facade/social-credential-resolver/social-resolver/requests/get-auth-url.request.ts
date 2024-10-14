import { ChainId } from '../../../../../../domain/entities/environment';

export class GetAuthUrlRequest {
  ens: string;
  chainId: ChainId;
  authId: string;
}
