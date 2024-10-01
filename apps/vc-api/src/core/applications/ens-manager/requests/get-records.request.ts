import { ChainId } from '../../../domain/entities/environment';

export class GetRecordsRequest {
  ens: string
  chainId: ChainId
}
