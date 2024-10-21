import { Subname } from '../../domain/entities/subname';

export const SUBNAME_RECORDS_FETCHER = 'SUBNAME_RECORDS_FETCHER';

export interface ISubnameRecordsFetcher {
  fetchRecords(subname: string, chainId: number, texts?: string[]): Promise<Subname>;
}
