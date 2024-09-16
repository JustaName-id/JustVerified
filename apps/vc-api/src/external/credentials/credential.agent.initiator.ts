import { Injectable } from '@nestjs/common';
import type {
  ICredentialPlugin,
  IDIDManager,
  IIdentifier,
  IKeyManager,
  IResolver,
  TAgent,
} from '@veramo/core';
import type { ICredentialIssuerEIP712 } from '@veramo/credential-eip712';
import type {} from '@veramo/did-manager';
import type {} from '@veramo/key-manager';
import type {} from '@veramo/kms-local';
import type {} from '@veramo/did-provider-ethr';
import type {} from '@veramo/did-resolver';
import type {} from '@veramo/credential-w3c';
import type {} from '@veramo/credential-ld';
import {} from '@veramo/credential-ld';

export type Agent = TAgent<
  IDIDManager &
    IKeyManager &
    IResolver &
    ICredentialPlugin &
    ICredentialIssuerEIP712
>;
export type Identifier = IIdentifier;

@Injectable()
export class CredentialAgentInitiator {
  agent: Agent;
  constructor(agent: Agent) {
    this.agent = agent;
  }

  async createAgentWithIdentifier(
    ensDomain: string,
    publicKey: string,
    privateKey: string,
    chainId: number,
  ): Promise<{
    agent: Agent;
    identifier: Identifier;
  }> {

    const identifier = await this.agent.didManagerImport({
      did: 'did:ens:' + (chainId === 1 ? '' : 'sepolia:') + ensDomain + '#' + publicKey,
      provider: 'did:ens',
      keys: [
        {
          privateKeyHex: privateKey,
          type: 'Secp256k1',
          kms: 'local',
        },
      ],
    });

    return { agent: this.agent, identifier };
  }
}
