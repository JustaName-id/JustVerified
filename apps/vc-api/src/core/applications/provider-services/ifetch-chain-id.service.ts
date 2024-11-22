export const FETCH_CHAIN_ID_SERVICE = 'FETCH_CHAIN_ID_SERVICE';

export interface IFetchChainIdService {
    getChainId(providerUrl: string): Promise<number>;
}