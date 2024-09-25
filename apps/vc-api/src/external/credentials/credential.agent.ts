import {Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {ICredentialCreator} from "../../core/applications/credentials/creator/icredential.creator";
import {ICredentialVerifier} from "../../core/applications/credentials/verifier/icredential.verifier";
import {ENVIRONMENT_GETTER, IEnvironmentGetter} from "../../core/applications/environment/ienvironment.getter";
import {EthereumEip712Signature2021, VerifiableEthereumEip712Signature2021} from "../../core/domain/entities/eip712";
import {IKeyManagementFetcher, KEY_MANAGEMENT_FETCHER} from "../../core/applications/key-management/ikey-management.fetcher";
import {CREDENTIAL_AGENT_MAPPER, ICredentialAgentMapper} from "./mapper/icredential-agent.mapper";
import { Agent, CredentialAgentInitiator, Identifier } from './credential.agent.initiator';
import { IDIDResolver } from '../../core/applications/did/resolver/idid.resolver';

@Injectable()
export class CredentialAgent implements ICredentialCreator, ICredentialVerifier,IDIDResolver, OnModuleInit {

  private agent: Agent
  private identifier: Identifier

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

    const { agent, identifier } = await this.agentInitiator.createAgentWithIdentifier(
      this.environmentGetter.getEnsDomain(),
      this.keyManagementFetcher.fetchKey().publicKey,
      this.keyManagementFetcher.fetchKey().privateKey,
      this.environmentGetter.getChainId()
    )
    this.agent = agent
    this.identifier = identifier
  }

  async createCredential(credential: EthereumEip712Signature2021): Promise<VerifiableEthereumEip712Signature2021> {
    const verifiedCredential =  await this.agent.createVerifiableCredentialEIP712(
      this.credentialAgentMapper.mapEthereumEip712Signature2021ToVeramoICreateVerifiableCredentialEIP712Args(this.identifier.did,credential)
    )

    return this.credentialAgentMapper.mapVeramoVerifiedCredentialToVerifiedEthereumEip721Signature2021(verifiedCredential)
  }

  async getEnsDid(ens: string): Promise<string> {
    const didUrl = 'did:ens:' + (this.environmentGetter.getChainId() === 1 ? '' : 'sepolia:') + ens
    const did = await this.agent.resolveDid({
      didUrl
    })
    return typeof did.didDocument.authentication[0] === 'string' ? did.didDocument.authentication[0] : did.didDocument.authentication[0].id
  }

  verifyCredential(verifiedEthereumEip712Signature2021: VerifiableEthereumEip712Signature2021): Promise<boolean> {
    return this.agent.verifyVerifiableCredentialEIP712({
      credential: this.credentialAgentMapper.mapVerifiedEthereumEip721Signature2021ToVeramoVerifiedCredential(verifiedEthereumEip712Signature2021)
    })
  }
}
