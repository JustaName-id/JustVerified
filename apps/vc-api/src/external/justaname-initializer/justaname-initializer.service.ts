
import { IEnsManagerService } from '../../core/applications/ens-manager/iens-manager.service';
import { SignInRequest } from '../../core/applications/ens-manager/requests/sign-in.request';
import { SignInResponse } from '../../core/applications/ens-manager/responses/sign-in.response';
import { JustaName, SubnameRecordsResponse } from '@justaname.id/sdk';
import { Inject } from '@nestjs/common';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../core/applications/environment/ienvironment.getter';
import { GetRecordsRequest } from '../../core/applications/ens-manager/requests/get-records.request';
import { GetRecordsResponse } from '../../core/applications/ens-manager/responses/get-records.response';
import { VerifiableEthereumEip712Signature2021 } from '../../core/domain/entities/eip712';
import {
  IKeyManagementFetcher,
  KEY_MANAGEMENT_FETCHER
} from '../../core/applications/key-management/ikey-management.fetcher';

export class JustaNameInitializerService implements IEnsManagerService {

  justaname: JustaName
  constructor(
    @Inject(ENVIRONMENT_GETTER) private readonly environmentGetter: IEnvironmentGetter,
    @Inject(KEY_MANAGEMENT_FETCHER) private readonly keyManagementFetcher: IKeyManagementFetcher
  ) {
    this.justaname = JustaName.init({
      config: {
        chainId: this.environmentGetter.getChainId(),
        domain: this.environmentGetter.getSiweDomain(),
        origin:this.environmentGetter.getSiweOrigin(),
      },
      ensDomain: this.environmentGetter.getEnsDomain(),
      providerUrl: (this.environmentGetter.getChainId() === 1 ? 'https://mainnet.infura.io/v3/' :'https://sepolia.infura.io/v3/') + this.environmentGetter.getInfuraProjectId()
    })
  }

  async signIn(params: SignInRequest): Promise<SignInResponse> {
    const sign = await this.justaname.signIn.signIn(params.message,params.signature)

    return {
      address: sign.data.address,
      ens: sign.ens
    }
  }

  generateNonce(): string {
    return this.justaname.signIn.generateNonce();
  }

  async getRecords(params: GetRecordsRequest): Promise<GetRecordsResponse> {
    const providerUrl = (params.chainId === 1 ? 'https://mainnet.infura.io/v3/' :'https://sepolia.infura.io/v3/') + this.environmentGetter.getInfuraProjectId()

    const records: SubnameRecordsResponse = await this.justaname.subnames.getRecordsByFullName({
      fullName: params.ens,
      providerUrl: providerUrl,
      chainId: params.chainId
    })

    return this.mapSubnameRecordsResponseToGetRecordsResponse(records)
  }

  checkIfMAppEnabled(ens: string): Promise<boolean> {
    return this.justaname.mApps.checkIfMAppIsEnabled({
      mApp: this.environmentGetter.getEnsDomain(),
      ens: ens,
      chainId: this.environmentGetter.getChainId()
    })
  }

  async appendVcInMAppEnabledEns(ens: string, vc: VerifiableEthereumEip712Signature2021, field: string): Promise<boolean> {
    const message = await this.justaname.mApps.requestAppendMAppFieldChallenge({
      mApp: this.environmentGetter.getEnsDomain(),
      subname: ens,
      address: this.keyManagementFetcher.fetchKey().publicKey,
    })


    const signature = await this.keyManagementFetcher.signMessage(message.challenge)


    const appended = await this.justaname.mApps.appendMAppField({
      subname: ens,
      fields: [{
        key: field,
        value: JSON.stringify(vc),
      }]
    }, {
      xAddress: this.keyManagementFetcher.fetchKey().publicKey,
      xMessage: message.challenge,
      xSignature: signature
    })

    return !!appended
  }

  private mapSubnameRecordsResponseToGetRecordsResponse(records: SubnameRecordsResponse): GetRecordsResponse {
    return {
      texts: records.texts,
      resolverAddress: records.resolverAddress,
      contentHash: records.contentHash,
      coins: records.coins,
      isJAN: records.isJAN,
    }
  }
}
