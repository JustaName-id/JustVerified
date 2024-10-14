
import {Wallet} from "ethers";
import {Inject, Injectable} from "@nestjs/common";
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../core/applications/environment/ienvironment.getter';
import { IKeyManagementFetcher } from '../../core/applications/key-management/ikey-management.fetcher';
import { SigningWallet } from '../../core/domain/entities/signingWallet';
import { ChainId } from '../../core/domain/entities/environment';

@Injectable()
export class KeyManagementFetcher implements IKeyManagementFetcher {

  private readonly mainnetWallet: Wallet
  private readonly sepoliaWallet: Wallet
  constructor(
    @Inject(ENVIRONMENT_GETTER)
    private readonly environmentGetter: IEnvironmentGetter,
  ) {
    this.mainnetWallet = new Wallet(this.environmentGetter.getPk())
    this.sepoliaWallet = new Wallet(this.environmentGetter.getPkSepolia())
  }


  fetchKey(chainId: ChainId): SigningWallet {
    return {
      publicKey: chainId === 1 ? this.mainnetWallet.address : this.sepoliaWallet.address,
      privateKey: chainId === 1 ? this.mainnetWallet.privateKey : this.sepoliaWallet.privateKey
    }
  }

  signMessage(message: string, chainId: ChainId): Promise<string> {
    return chainId === 1 ? this.mainnetWallet.signMessage(message) : this.sepoliaWallet.signMessage(message)
  }

}
