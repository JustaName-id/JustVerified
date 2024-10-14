import { ChainId } from '../../../domain/entities/environment';

export const DID_RESOLVER = 'DID_RESOLVER'

export interface IDIDResolver {
   getEnsDid(ens: string, chainId: ChainId): Promise<string>
}
