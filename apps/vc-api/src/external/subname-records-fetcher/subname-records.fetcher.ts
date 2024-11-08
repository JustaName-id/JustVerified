import { ISubnameRecordsFetcher } from '../../core/applications/verify-records/isubname-records.fetcher';
import { Inject, Injectable } from '@nestjs/common';
import { Subname } from '../../core/domain/entities/subname';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../core/applications/environment/ienvironment.getter';
import { ENS_MANAGER_SERVICE, IEnsManagerService } from '../../core/applications/ens-manager/iens-manager.service';
import { ChainId } from '../../core/domain/entities/environment';
import { GetRecordsResponse } from '../../core/applications/ens-manager/responses/get-records.response';
import {  getRecords } from '@ensdomains/ensjs/public';
import {createClient, http} from "viem";
import {mainnet, sepolia} from "viem/chains";

@Injectable()
export class SubnameRecordsFetcher implements ISubnameRecordsFetcher {
  constructor(
    @Inject(ENVIRONMENT_GETTER) private readonly environmentGetter: IEnvironmentGetter,
    @Inject(ENS_MANAGER_SERVICE) private readonly ensManagerService: IEnsManagerService
  ) {}

  async fetchRecords(subname: string, chainId: ChainId, texts?: string[]): Promise<Subname> {

    let records: GetRecordsResponse;
    const providerUrl = (chainId === 1 ? 'https://mainnet.infura.io/v3/' :'https://sepolia.infura.io/v3/') + this.environmentGetter.getInfuraProjectId()

    if(texts) {
      const client = createClient({
        chain: chainId === 1 ? mainnet : sepolia,
        transport: http(providerUrl)
      });

      const recordsFromEns = await getRecords(client,{
        name: subname,
        texts: texts,
        coins: ['eth'],
        contentHash: true
      });

      records = {
        ...recordsFromEns,
        isJAN: false
      }
    }
    else{
      records = await this.ensManagerService.getRecords({
        ens: subname,
        chainId: chainId,
      })
    }

    return this.mapSubnameRecordsResponseToSubname(subname, records);
  }

  mapSubnameRecordsResponseToSubname(subname: string, records: GetRecordsResponse): Subname {
    return {
      subname: subname,
      metadata: {
        contentHash: records.contentHash?.decoded ?? '',
        addresses: records.coins.map(coin => ({
          id: String(coin.id),
          coinType: coin.id,
          address: coin.value,
          metadataId: ''
        })),
        textRecords: records.texts.map(text => ({
          key: text.key,
          value: text.value
        }))
      }
    };
  }
}
