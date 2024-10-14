import {SigningWallet} from "../../domain/entities/signingWallet";
import { ChainId } from '../../domain/entities/environment';

export const KEY_MANAGEMENT_FETCHER = 'KEY_MANAGEMENT_FETCHER';

export interface IKeyManagementFetcher {
  fetchKey(chainId: ChainId): SigningWallet;
  signMessage(message: string, chainId: ChainId): Promise<string>
}
