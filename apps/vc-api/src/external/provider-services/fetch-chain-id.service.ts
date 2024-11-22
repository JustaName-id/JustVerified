import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { IFetchChainIdService } from '../../core/applications/provider-services/ifetch-chain-id.service';
import { Web3ProviderException } from '../../core/domain/exceptions/Web3Provider.exception';

@Injectable()
export class FetchChainIdService implements IFetchChainIdService {
    providerChainIdMap: Map<string, number> = new Map();


    async getChainId(providerUrl: string): Promise<number> {
      try {
        if (this.providerChainIdMap.has(providerUrl)) {
          return this.providerChainIdMap.get(providerUrl) as number;
        }

        const provider = new ethers.JsonRpcProvider(providerUrl);
        const network = await provider.getNetwork();
        
        this.providerChainIdMap.set(providerUrl, Number(network.chainId));

        return Number(network.chainId)
      } catch (e) {
        throw Web3ProviderException.withMessage(providerUrl);
      }
    }
}