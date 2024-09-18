import { ISdkInitializerGetter } from '../../core/applications/environment/isdk-initializer.getter';
import { Inject, Injectable } from '@nestjs/common';
import { JustaName } from '@justaname.id/sdk';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../core/applications/environment/ienvironment.getter';

@Injectable()
export class SdkInitializerGetter implements ISdkInitializerGetter {
  justaname: JustaName
  constructor(
    @Inject(ENVIRONMENT_GETTER) private readonly environmentGetter: IEnvironmentGetter,
  ) {}

  getInitializedSdk(): JustaName {
    return this.justaname = JustaName.init({
      config: {
        chainId: this.environmentGetter.getChainId(),
        domain: this.environmentGetter.getSiweDomain(),
        origin:this.environmentGetter.getSiweOrigin(),
      },
      ensDomain: this.environmentGetter.getEnsDomain(),
      providerUrl: (this.environmentGetter.getChainId() === 1 ? 'https://mainnet.infura.io/v3/' :'https://sepolia.infura.io/v3/') + this.environmentGetter.getInfuraProjectId()
    })
  }

}
