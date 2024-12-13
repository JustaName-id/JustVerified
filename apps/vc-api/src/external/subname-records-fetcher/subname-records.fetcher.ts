import { ISubnameRecordsFetcher } from '../../core/applications/verify-records/isubname-records.fetcher';
import { Injectable } from '@nestjs/common';
import { Subname } from '../../core/domain/entities/subname';
import { ChainId } from '../../core/domain/entities/environment';
import { GetRecordsResponse } from '../../core/applications/ens-manager/responses/get-records.response';
import { getRecords, batch } from '@ensdomains/ensjs/public';
import { createClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { RecordsFetchingException } from '../../core/domain/exceptions/RecordsFetching.exception';

@Injectable()
export class SubnameRecordsFetcher implements ISubnameRecordsFetcher {
  constructor() {}

  async fetchRecords(
    providerUrl: string,
    subname: string,
    chainId: ChainId,
    texts?: string[]
  ): Promise<Subname> {
    try {
      const client = createClient({
        chain: chainId === 1 ? mainnet : sepolia,
        transport: http(providerUrl),
      });

      const recordsFromEns = await getRecords(client, {
        name: subname,
        texts: texts,
        coins: ['eth'],
        contentHash: true,
      });

      const records: GetRecordsResponse = {
        ...recordsFromEns,
        isJAN: false,
      };

      return this.mapSubnameRecordsResponseToSubname(subname, records);
    } catch (error) {
      throw RecordsFetchingException.forSubnamesWithProvider(
        [subname],
        providerUrl
      );
    }
  }

  async fetchRecordsFromManySubnames(
    providerUrl: string,
    subnames: string[],
    chainId: ChainId,
    texts: string[]
  ): Promise<Subname[]> {
    try {
      const client = createClient({
        chain: chainId === 1 ? mainnet : sepolia,
        transport: http(providerUrl),
      });

      const batchRequests = subnames.map((name) =>
        getRecords.batch({
          name,
          texts,
          coins: ['eth'],
          contentHash: true,
        })
      );

      const recordsFromEns = await batch(client, ...batchRequests);

      const records: GetRecordsResponse[] = subnames.map((_, index) => ({
        ...recordsFromEns[index],
        isJAN: false,
      }));

      return this.mapSubnameRecordsResponsesToSubnameArray(subnames, records);
    } catch (error) {
      throw RecordsFetchingException.forSubnamesWithProvider(
        subnames,
        providerUrl
      );
    }
  }

  mapSubnameRecordsResponseToSubname(
    subname: string,
    records: GetRecordsResponse
  ): Subname {
    return {
      subname: subname,
      metadata: {
        contentHash: records.contentHash?.decoded ?? '',
        addresses: records.coins.map((coin) => ({
          id: String(coin.id),
          coinType: coin.id,
          address: coin.value,
          metadataId: '',
        })),
        textRecords: records.texts.map((text) => ({
          key: text.key,
          value: text.value,
        })),
      },
    };
  }

  mapSubnameRecordsResponsesToSubnameArray(
    subnames: string[],
    records: GetRecordsResponse[]
  ): Subname[] {
    return subnames.map((subname, index) =>
      this.mapSubnameRecordsResponseToSubname(subname, records[index])
    );
  }
}
