import { ChainId } from '../../domain/entities/environment';
import { Subname } from '../../domain/entities/subname';

export const SUBNAME_RECORDS_FETCHER = 'SUBNAME_RECORDS_FETCHER';

export interface ISubnameRecordsFetcher {
  fetchRecords(subname: string, chainId: ChainId, texts?: string[]): Promise<Subname>;
  fetchRecordsFromManySubnames(subnames: string[], chainId: ChainId, texts?: string[]): Promise<Subname[]>
}
