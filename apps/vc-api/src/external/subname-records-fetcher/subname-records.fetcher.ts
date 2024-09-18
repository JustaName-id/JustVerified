import { ISubnameRecordsFetcher } from '../../core/applications/verify-records/isubname-records.fetcher';
import { Inject, Injectable } from '@nestjs/common';
import { Subname } from '../../core/domain/entities/subname';
import { ChainId, SubnameRecordsResponse } from '@justaname.id/sdk';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../core/applications/environment/ienvironment.getter';
import {
  ISdkInitializerGetter,
  SDK_INITIALIZER_GETTER
} from '../../core/applications/environment/isdk-initializer.getter';


@Injectable()
export class SubnameRecordsFetcher implements ISubnameRecordsFetcher {
  constructor(
    @Inject(ENVIRONMENT_GETTER) private readonly environmentGetter: IEnvironmentGetter,
    @Inject(SDK_INITIALIZER_GETTER) private readonly sdkInitializerGetter: ISdkInitializerGetter,

  ) {}

  async fetchRecords(subname: string, chainId: number): Promise<Subname> {
    const providerUrl = (chainId === 1 ? 'https://mainnet.infura.io/v3/' :'https://sepolia.infura.io/v3/') + this.environmentGetter.getInfuraProjectId()

    const records: SubnameRecordsResponse = await this.sdkInitializerGetter.getInitializedSdk().subnames.getRecordsByFullName({
      fullName: subname,
      providerUrl: providerUrl,
      chainId: chainId as ChainId
    })

    return this.mapSubnameRecordsResponseToSubname(subname, records);
  }

  mapSubnameRecordsResponseToSubname(subname: string, records: SubnameRecordsResponse): Subname {
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
