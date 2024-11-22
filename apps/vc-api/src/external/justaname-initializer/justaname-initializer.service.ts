import { IEnsManagerService } from '../../core/applications/ens-manager/iens-manager.service';
import { SignInRequest } from '../../core/applications/ens-manager/requests/sign-in.request';
import { SignInResponse } from '../../core/applications/ens-manager/responses/sign-in.response';
import { JustaName, SubnameResponse, ChainId } from '@justaname.id/sdk';
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
    this.justaname = JustaName.init({
      dev: this.environmentGetter.getEnv() === 'staging' || this.environmentGetter.getEnv() === 'development',
      config: {
        origin: this.environmentGetter.getOrigin(),
        domain: this.environmentGetter.getDomain(),
      },
      networks: [
        {
          chainId: 1,
          providerUrl: 'https://mainnet.infura.io/v3/' + this.environmentGetter.getInfuraProjectId()
        },
        {
          chainId: 11155111,
          providerUrl: 'https://sepolia.infura.io/v3/' + this.environmentGetter.getInfuraProjectId()
        }
      ]
    })
  }

  async signIn(params: SignInRequest): Promise<SignInResponse> {
    try {
      const sign = await this.justaname.signIn.signIn({
          message: params.message,
          signature: params.signature,
          nonce: params.nonce
      });

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

      const records: SubnameResponse = await this.justaname.subnames.getRecords({
        ens: params.ens,
        providerUrl: providerUrl,
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
      address: this.keyManagementFetcher.fetchKey(chainId).publicKey,
    })
      const signature = await this.keyManagementFetcher.signMessage(message.challenge, chainId)

      const appended = await this.justaname.mApps.appendMAppField({
        subname: ens,
        fields: [{
          key: field,
          value: JSON.stringify(vc),
        }]
      }, {
        xAddress: this.keyManagementFetcher.fetchKey(chainId).publicKey,
        xMessage: message.challenge,
        xSignature: signature
      })

      return !!appended
    } catch (error) {
      throw JustaNameInitializerException.withError(error);
    }
  }

  private mapSubnameRecordsResponseToGetRecordsResponse(response: SubnameResponse): GetRecordsResponse {
    return {
      texts: response?.records?.texts,
      resolverAddress: response?.records?.resolverAddress,
      contentHash: response?.records?.contentHash,
      coins: response?.records?.coins,
      isJAN: response.isJAN,
    }
  }
}
