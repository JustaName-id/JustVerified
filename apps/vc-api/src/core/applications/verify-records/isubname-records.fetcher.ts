import { ChainId } from '../../domain/entities/environment';
import { Subname } from '../../domain/entities/subname';

export const SUBNAME_RECORDS_FETCHER = 'SUBNAME_RECORDS_FETCHER';

export interface ISubnameRecordsFetcher {
  fetchRecords(providerUrl: string, subname: string, chainId: ChainId, texts: string[]): Promise<Subname>;
  fetchRecordsFromManySubnames(providerUrl: string, subnames: string[], chainId: ChainId, texts: string[]): Promise<Subname[]>
}
