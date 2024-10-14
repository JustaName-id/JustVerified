import { IEnsManagerService } from '../../core/applications/ens-manager/iens-manager.service';
import { SignInRequest } from '../../core/applications/ens-manager/requests/sign-in.request';
import { SignInResponse } from '../../core/applications/ens-manager/responses/sign-in.response';
import { ChainId, JustaName, SubnameRecordsResponse } from '@justaname.id/sdk';
import { Inject } from '@nestjs/common';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../core/applications/environment/ienvironment.getter';
import { GetRecordsRequest } from '../../core/applications/ens-manager/requests/get-records.request';
import { GetRecordsResponse } from '../../core/applications/ens-manager/responses/get-records.response';
import { VerifiableEthereumEip712Signature2021 } from '../../core/domain/entities/ethereumEip712Signature';
import {
  IKeyManagementFetcher,
  KEY_MANAGEMENT_FETCHER
} from '../../core/applications/key-management/ikey-management.fetcher';
import { JustaNameInitializerException } from '../../core/domain/exceptions/JustaNameInitializer.exception';
import { AuthenticationException } from '../../core/domain/exceptions/Authentication.exception';

export class JustaNameInitializerService implements IEnsManagerService {

  justaname: JustaName
  constructor(
    @Inject(ENVIRONMENT_GETTER) private readonly environmentGetter: IEnvironmentGetter,
    @Inject(KEY_MANAGEMENT_FETCHER) private readonly keyManagementFetcher: IKeyManagementFetcher
  ) {
    this.justaname = JustaName.init({})
  }

  async signIn(params: SignInRequest): Promise<SignInResponse> {
    try {
      const sign = await this.justaname.signIn.signIn(
        params.message,
        params.signature
      );

      return {
        address: sign.data.address,
        ens: sign.ens,
        chainId: sign.data.chainId as ChainId,
      };
    } catch (error) {
      throw AuthenticationException.withError(error);
    }
  }

  generateNonce(): string {
    return this.justaname.signIn.generateNonce();
  }

  async getRecords(params: GetRecordsRequest): Promise<GetRecordsResponse> {
    try {
      const providerUrl = (params.chainId === 1 ? 'https://mainnet.infura.io/v3/' :'https://sepolia.infura.io/v3/') + this.environmentGetter.getInfuraProjectId()

      const records: SubnameRecordsResponse = await this.justaname.subnames.getRecordsByFullName({
        fullName: params.ens,
        providerUrl: providerUrl,
        chainId: params.chainId,
      })

      return this.mapSubnameRecordsResponseToGetRecordsResponse(records)
    } catch (error) {
      throw JustaNameInitializerException.withError(error);
    }
  }

  checkIfMAppEnabled(ens: string, chainId: ChainId): Promise<boolean> {
    return this.justaname.mApps.checkIfMAppIsEnabled({
      mApp: this.environmentGetter.getEnsDomain(),
      ens: ens,
      chainId: chainId
    })
  }

  async appendVcInMAppEnabledEns(ens: string, chainId: ChainId, vc: VerifiableEthereumEip712Signature2021, field: string): Promise<boolean> {
    try {
      const message = await this.justaname.mApps.requestAppendMAppFieldChallenge({
        mApp: this.environmentGetter.getEnsDomain(),
        subname: ens,
        chainId: chainId,
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
    } catch (error) {
      throw JustaNameInitializerException.withError(error);
    }
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
