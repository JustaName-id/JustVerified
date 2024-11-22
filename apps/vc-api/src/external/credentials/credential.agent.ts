import {Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {ICredentialCreator} from "../../core/applications/credentials/creator/icredential.creator";
import {ICredentialVerifier} from "../../core/applications/credentials/verifier/icredential.verifier";
import {ENVIRONMENT_GETTER, IEnvironmentGetter} from "../../core/applications/environment/ienvironment.getter";
import {EthereumEip712Signature2021, VerifiableEthereumEip712Signature2021} from "../../core/domain/entities/ethereumEip712Signature";
import {IKeyManagementFetcher, KEY_MANAGEMENT_FETCHER} from "../../core/applications/key-management/ikey-management.fetcher";
import {CREDENTIAL_AGENT_MAPPER, ICredentialAgentMapper} from "./mapper/icredential-agent.mapper";
import { Agent, CredentialAgentInitiator, Identifier } from './credential.agent.initiator';
import { IDIDResolver } from '../../core/applications/did/resolver/idid.resolver';
import { ChainId } from '../../core/domain/entities/environment';

@Injectable()
export class CredentialAgent implements ICredentialCreator, ICredentialVerifier,IDIDResolver, OnModuleInit {

  private mainnetAgent: Agent
  private mainnetIdentifier: Identifier
  private sepoliaAgent: Agent
  private sepoliaIdentifier: Identifier

  constructor(
    @Inject(ENVIRONMENT_GETTER)
    private readonly environmentGetter: IEnvironmentGetter,

    @Inject(KEY_MANAGEMENT_FETCHER)
    private readonly keyManagementFetcher: IKeyManagementFetcher,

    @Inject(CREDENTIAL_AGENT_MAPPER)
    private readonly credentialAgentMapper: ICredentialAgentMapper,

    private readonly agentInitiator: CredentialAgentInitiator
  ) {
  }

  async  onModuleInit(){
    const mainnetChainId = 1;
    const sepoliaChainId = 11155111;

    const { agent, identifier } = await this.agentInitiator.createAgentWithIdentifier(
      this.environmentGetter.getEnsDomain(),
      this.keyManagementFetcher.fetchKey(mainnetChainId).publicKey,
      this.keyManagementFetcher.fetchKey(mainnetChainId).privateKey,
      mainnetChainId
    )
    this.mainnetAgent = agent
    this.mainnetIdentifier = identifier

    const {agent: sepoliaAgent, identifier: sepoliaIdentifier} = await this.agentInitiator.createAgentWithIdentifier(
      this.environmentGetter.getEnsDomain(),
      this.keyManagementFetcher.fetchKey(sepoliaChainId).publicKey,
      this.keyManagementFetcher.fetchKey(sepoliaChainId).privateKey,
      sepoliaChainId
    )

    this.sepoliaAgent = sepoliaAgent
    this.sepoliaIdentifier = sepoliaIdentifier
  }

  async createCredential(credential: EthereumEip712Signature2021, chainId: ChainId): Promise<VerifiableEthereumEip712Signature2021> {
    const verifiedCredential =  await this.getAgent(chainId).createVerifiableCredentialEIP712(
      this.credentialAgentMapper.mapEthereumEip712Signature2021ToVeramoICreateVerifiableCredentialEIP712Args(this.getIdentifier(chainId).did, credential)
    )

    return this.credentialAgentMapper.mapVeramoVerifiedCredentialToVerifiedEthereumEip721Signature2021(verifiedCredential)
  }

  async getEnsDid(ens: string, chainId: ChainId): Promise<string> {
    const didUrl = 'did:ens:' + (chainId === 1 ? '' : 'sepolia:') + ens
    const did = await this.getAgent(chainId).resolveDid({
      didUrl
    })
    return typeof did.didDocument.authentication[0] === 'string' ? did.didDocument.authentication[0] : did.didDocument.authentication[0].id
  }

  async verifyCredential(verifiedEthereumEip712Signature2021: VerifiableEthereumEip712Signature2021, chainId: ChainId): Promise<boolean> {
    const verifiedCredential = await this.getAgent(chainId).verifyCredentialEIP712({
      credential: this.credentialAgentMapper.mapVerifiedEthereumEip721Signature2021ToVeramoVerifiedCredential(verifiedEthereumEip712Signature2021)
    })

    return verifiedCredential
  }

  private getAgent(chainId: ChainId): Agent {
    return chainId === 1 ? this.mainnetAgent : this.sepoliaAgent
  }

  private getIdentifier(chainId: ChainId): Identifier {
    return chainId === 1 ? this.mainnetIdentifier : this.sepoliaIdentifier
  }
}
