
import {Wallet} from "ethers";
import {Inject, Injectable} from "@nestjs/common";
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../core/applications/environment/ienvironment.getter';
import { IKeyManagementFetcher } from '../../core/applications/key-management/ikey-management.fetcher';
import { SigningWallet } from '../../core/domain/entities/signingWallet';

@Injectable()
export class KeyManagementFetcher implements IKeyManagementFetcher {

  private readonly wallet: Wallet
  constructor(
    @Inject(ENVIRONMENT_GETTER)
    private readonly environmentGetter: IEnvironmentGetter,
  ) {
    this.wallet = new Wallet(this.environmentGetter.getPk())
  }


  fetchKey(): SigningWallet {
    return {
      publicKey: this.wallet.address,
      privateKey: this.wallet.privateKey
    }
  }

  signMessage(message: string): Promise<string> {
    return this.wallet.signMessage(message);
  }

}
