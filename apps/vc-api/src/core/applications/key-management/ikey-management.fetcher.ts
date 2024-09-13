import {SigningWallet} from "../../domain/entities/signingWallet";

export const KEY_MANAGEMENT_FETCHER = 'KEY_MANAGEMENT_FETCHER';

export interface IKeyManagementFetcher {
  fetchKey(): SigningWallet;
}
