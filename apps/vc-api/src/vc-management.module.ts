import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { JwtModule } from '@nestjs/jwt';
import {validate} from "./config/env.validation";
import { Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import { getResolver as ensDidResolver } from '@justverified/ens-did-resolver';
import { CredentialsController } from './api/credentials/credentials.controller';
import { CREDENTIAL_CREATOR_FACADE } from './core/applications/credentials/facade/icredential.facade';
import { CredentialCreatorFacade } from './core/applications/credentials/facade/credential.facade';
import { SOCIAL_CREDENTIAL_RESOLVER } from './core/applications/credentials/facade/social-credential-resolver/isocial.credential.resolver';
import { SocialCredentialResolver } from './core/applications/credentials/facade/social-credential-resolver/social.credential.resolver';
import {
  GithubSocialResolver
} from './core/applications/credentials/facade/social-credential-resolver/social-resolver/github.social.resolver';
import { EnvironmentGetter } from './core/applications/environment/environment.getter';
import { ENVIRONMENT_GETTER } from './core/applications/environment/ienvironment.getter';
import { HttpModule } from '@nestjs/axios';
import { CredentialAgent } from './external/credentials/credential.agent';
import { CREDENTIAL_CREATOR } from './core/applications/credentials/creator/icredential.creator';
import { CREDENTIAL_VERIFIER } from './core/applications/credentials/verifier/icredential.verifier';
import { KeyManagementFetcher } from './external/key-management/key-management.fetcher';
import { KEY_MANAGEMENT_FETCHER } from './core/applications/key-management/ikey-management.fetcher';
import { CredentialAgentMapper } from './external/credentials/mapper/credential-agent.mapper';
import { CREDENTIAL_AGENT_MAPPER } from './external/credentials/mapper/icredential-agent.mapper';
import { DateGenerator } from './external/time-manager/date.generator';
import { TIME_GENERATOR } from './core/applications/time.generator';
import { Agent, CredentialAgentInitiator } from './external/credentials/credential.agent.initiator';
import {
  DiscordSocialResolver
} from './core/applications/credentials/facade/social-credential-resolver/social-resolver/discord.social.resolver';
import {
  TelegramSocialResolver
} from './core/applications/credentials/facade/social-credential-resolver/social-resolver/telegram.social.resolver';
import {
  TwitterSocialResolver
} from './core/applications/credentials/facade/social-credential-resolver/social-resolver/twitter.social.resolver';
import { OpenPassportSocialResolver } from './core/applications/credentials/facade/social-credential-resolver/social-resolver/openpassport.social.resolver';
import { CredentialsControllerMapper } from './api/credentials/mapper/credentials.controller.mapper';
import { AUTH_CONTROLLER_MAPPER } from './api/credentials/mapper/icredentials.controller.mapper';
import { AuthController } from './api/auth/auth.controller';
import { DID_RESOLVER } from './core/applications/did/resolver/idid.resolver';
import { CryptoService } from './external/crypto/crypto.service';
import { CRYPTO_SERVICE } from './core/applications/crypto/icrypto.service';
import { VerifyRecordsService } from './core/applications/verify-records/verify-records.service';
import { VERIFY_RECORDS_SERVICE } from './core/applications/verify-records/iverify-records.service';
import { SubnameRecordsFetcher } from './external/subname-records-fetcher/subname-records.fetcher';
import { SUBNAME_RECORDS_FETCHER } from './core/applications/verify-records/isubname-records.fetcher';
import { VerifyRecordsController } from './api/verify-records/verify-records.controller';
import { VerifyRecordsControllerMapper } from './api/verify-records/mapper/verify-records.controller.mapper';
import { VERIFY_RECORDS_CONTROLLER_MAPPER } from './api/verify-records/mapper/iverify-records.controller.mapper';
import { JustaNameInitializerService } from './external/justaname-initializer/justaname-initializer.service';
import { ENS_MANAGER_SERVICE } from './core/applications/ens-manager/iens-manager.service';
import { EMAIL_SENDER } from './core/applications/email-sender/iemail-sender.service';
import { EmailSender } from './external/email-sender/email-sender.service';
import {EmailResolver} from "./core/applications/credentials/facade/email-resolver/email.resolver";
import {EMAIL_RESOLVER} from "./core/applications/credentials/facade/email-resolver/iemail.resolver";
import { VCManagementApiFilters } from './api/filters/vc.api.filters';
import { APP_FILTER } from '@nestjs/core';
import { FetchChainIdService } from './external/provider-services/fetch-chain-id.service';
import { FETCH_CHAIN_ID_SERVICE } from './core/applications/provider-services/ifetch-chain-id.service';
import { OpenPassportService } from './external/openpassport/openpassport.service';
import { OPENPASSPORT_SERVICE } from './core/applications/openpassport/iopenpassport.service';

const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

@Module({
  imports: [
    ConfigModule.forRoot({
      validate
    }),
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    CredentialsController,
    AuthController,
    VerifyRecordsController
  ],
  providers: [
    ...VCManagementApiFilters.map((filter) => ({
      provide: APP_FILTER,
      useClass: filter,
    })),
    {
      useClass: FetchChainIdService,
      provide: FETCH_CHAIN_ID_SERVICE
    },
    {
      useClass: CredentialsControllerMapper,
      provide: AUTH_CONTROLLER_MAPPER
    },
    {
      useClass: CredentialCreatorFacade,
      provide: CREDENTIAL_CREATOR_FACADE
    },
    {
      useClass: SocialCredentialResolver,
      provide: SOCIAL_CREDENTIAL_RESOLVER
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
      useClass: CredentialAgent,
      provide: DID_RESOLVER
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
    {
      useClass: CryptoService,
      provide: CRYPTO_SERVICE
    },
    {
      useClass: VerifyRecordsService,
      provide: VERIFY_RECORDS_SERVICE
    },
    {
      useClass: SubnameRecordsFetcher,
      provide: SUBNAME_RECORDS_FETCHER
    },
    {
      useClass: JustaNameInitializerService,
      provide: ENS_MANAGER_SERVICE
    },
    {
      useClass: VerifyRecordsControllerMapper,
      provide: VERIFY_RECORDS_CONTROLLER_MAPPER
    },
    {
      useClass: EmailSender,
      provide: EMAIL_SENDER
    },
    {
      useClass: OpenPassportService,
      provide: OPENPASSPORT_SERVICE
    },
    GithubSocialResolver,
    DiscordSocialResolver,
    TelegramSocialResolver,
    TwitterSocialResolver,
    OpenPassportSocialResolver,
    {
      useClass: EmailResolver,
      provide: EMAIL_RESOLVER
    },
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
                ...ethrDidResolver({
                  networks: [
                    { name: 'sepolia', rpcUrl: 'https://sepolia.infura.io/v3/' + infuraProjectId },
                    { rpcUrl: 'https://mainnet.infura.io/v3/' + infuraProjectId }
                  ]
                }),
                ...ensDidResolver({
                  networks: [
                    { name: 'sepolia', rpcUrl: 'https://sepolia.infura.io/v3/' + infuraProjectId },
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
