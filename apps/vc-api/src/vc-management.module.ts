import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {validate} from "./config/env.validation";
import { AuthReadController } from './api/auth/auth.read.controller';
import { CREDENTIAL_CREATOR_FACADE } from './core/applications/credentials/facade/icredential.facade';
import { CredentialCreatorFacade } from './core/applications/credentials/facade/credential.facade';
import { SUBJECT_RESOLVER } from './core/applications/credentials/facade/subjects-resolvers/isubject.resolver';
import { SubjectResolver } from './core/applications/credentials/facade/subjects-resolvers/subject.resolver';
import {
  GithubSubjectResolver
} from './core/applications/credentials/facade/subjects-resolvers/subjects/github.subject.resolver';
import { EnvironmentGetter } from './core/applications/environment/environment.getter';
import { ENVIRONMENT_GETTER } from './core/applications/environment/ienvironment.getter';
import { HttpModule } from '@nestjs/axios';
import { CredentialAgent } from './external/credentails/credential.agent';
import { CREDENTIAL_CREATOR } from './core/applications/credentials/creator/icredential.creator';
import { CREDENTIAL_VERIFIER } from './core/applications/credentials/verifier/icredential.verifier';
import { KeyManagementFetcher } from './external/key-management/key-management.fetcher';
import { KEY_MANAGEMENT_FETCHER } from './core/applications/key-management/ikey-management.fetcher';
import { CredentialAgentMapper } from './external/credentails/mapper/credential-agent.mapper';
import { CREDENTIAL_AGENT_MAPPER } from './external/credentails/mapper/icredential-agent.mapper';
import { DateGenerator } from './external/time-manager/date.generator';
import { TIME_GENERATOR } from './core/applications/time.generator';
import { Agent, CredentialAgentInitiator } from './external/credentails/credential.agent.initiator';
import { Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import { getResolver as webDidResolver } from 'web-did-resolver';
import { getResolver as ensDidResolver } from 'ens-did-resolver';
import {
  DiscordSubjectResolver
} from './core/applications/credentials/facade/subjects-resolvers/subjects/discord.subject.resolver';
import {
  TelegramSubjectResolver
} from './core/applications/credentials/facade/subjects-resolvers/subjects/telegram.subject.resolver';
import {
  TwitterSubjectResolver
} from './core/applications/credentials/facade/subjects-resolvers/subjects/twitter.subject.resolver';

const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

@Module({
  imports: [
    ConfigModule.forRoot({
      validate
    }),
    HttpModule
  ],
  controllers: [
    AuthReadController
  ],
  providers: [
    {
      useClass: CredentialCreatorFacade,
      provide: CREDENTIAL_CREATOR_FACADE
    },
    {
      useClass: SubjectResolver,
      provide: SUBJECT_RESOLVER
    },
    {
      useClass: EnvironmentGetter,
      provide: ENVIRONMENT_GETTER
    },
    {
      useClass: CredentialAgent,
      provide: CREDENTIAL_CREATOR
    },
    {
      useClass: CredentialAgent,
      provide: CREDENTIAL_VERIFIER
    },
    {
      useClass: KeyManagementFetcher,
      provide: KEY_MANAGEMENT_FETCHER
    },
    {
      useClass: CredentialAgentMapper,
      provide: CREDENTIAL_AGENT_MAPPER
    },
    {
      useClass: DateGenerator,
      provide: TIME_GENERATOR
    },
    GithubSubjectResolver,
    DiscordSubjectResolver,
    TelegramSubjectResolver,
    TwitterSubjectResolver,
    {
      provide: CredentialAgentInitiator,
      async useFactory() {
        const infuraProjectId = process.env.INFURA_PROJECT_ID;

        const { CredentialIssuerEIP712 } = await dynamicImport('@veramo/credential-eip712');
        const { createAgent } = await dynamicImport('@veramo/core');
        const { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore } = await dynamicImport('@veramo/key-manager');
        const { KeyManagementSystem } = await dynamicImport('@veramo/kms-local');
        const { DIDManager, MemoryDIDStore } = await dynamicImport('@veramo/did-manager');
        const { EthrDIDProvider } = await dynamicImport('@veramo/did-provider-ethr');
        const { DIDResolverPlugin } = await dynamicImport('@veramo/did-resolver');
        const { CredentialPlugin } = await dynamicImport('@veramo/credential-w3c');
        const {
          CredentialIssuerLD,
          LdDefaultContexts,
          VeramoEd25519Signature2018,
          VeramoEcdsaSecp256k1RecoverySignature2020
        } = await dynamicImport('@veramo/credential-ld');
        const agent: Agent = createAgent({
          plugins: [
            new CredentialIssuerEIP712(),
            new KeyManager({
              store: new MemoryKeyStore(),
              kms: {
                local: new KeyManagementSystem(new MemoryPrivateKeyStore())
              }
            }),
            new DIDManager({
              store: new MemoryDIDStore(),
              defaultProvider: 'did:ethr',
              providers: {
                'did:ethr': new EthrDIDProvider({
                  defaultKms: 'local',
                  network: 'sepolia',
                  rpcUrl: 'https://sepolia.infura.io/v3/' + infuraProjectId
                })
              }
            }),
            new DIDResolverPlugin({
              resolver: new Resolver({
                ...ethrDidResolver({ infuraProjectId }),
                ...webDidResolver(),
                ...ensDidResolver({
                  networks: [
                    { name: 'goerli', rpcUrl: 'https://goerli.infura.io/v3/' + infuraProjectId },
                    { rpcUrl: 'https://mainnet.infura.io/v3/' + infuraProjectId }
                  ]
                })
              })
            }),
            new CredentialPlugin(),
            new CredentialIssuerLD({
              contextMaps: [LdDefaultContexts],
              suites: [
                new VeramoEd25519Signature2018(),
                new VeramoEcdsaSecp256k1RecoverySignature2020()
              ]
            })
          ]
        });



        return new CredentialAgentInitiator(agent);
      }
    }
  ],
})
export class VCManagementModule {}
