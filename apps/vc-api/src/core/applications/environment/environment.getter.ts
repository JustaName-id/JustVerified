import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IEnvironmentGetter} from "./ienvironment.getter";
import { ChainId, Environment, EnvironmentType } from '../../domain/entities/environment';

@Injectable()
export class EnvironmentGetter implements  IEnvironmentGetter {

  constructor(
    private readonly configService: ConfigService<Environment>,
  ) {}

  getPk(): string {
    return this.configService.get('SIGNING_PRIVATE_KEY');
  }

  getEnv(): EnvironmentType {
    return this.configService.get<EnvironmentType>('ENVIRONMENT');
  }

  getChainId(): ChainId {
    return parseInt(this.configService.get('CHAIN_ID')) as ChainId;
  }

  getEnsDomain(): string {
    return this.configService.get<string>('ENS_DOMAIN');
  }

  getInfuraProjectId(): string {
    return this.configService.get<string>('INFURA_PROJECT_ID');
  }

  getApiDomain(): string {
    return this.configService.get<string>('API_DOMAIN');
  }

  getGithubClientId(): string {
    return this.configService.get<string>('GITHUB_CLIENT_ID');
  }

  getGithubClientSecret(): string {
    return this.configService.get<string>('GITHUB_CLIENT_SECRET');
  }

  getDiscordClientId(): string {
    return this.configService.get<string>('DISCORD_CLIENT_ID');
  }

  getDiscordClientSecret(): string {
    return this.configService.get<string>('DISCORD_CLIENT_SECRET');
  }

  getTwitterClientId(): string {
    return this.configService.get<string>('TWITTER_CLIENT_ID');
  }

  getTwitterClientSecret(): string {
    return this.configService.get<string>('TWITTER_CLIENT_SECRET');
  }

  getTelegramBotToken(): string {
    return this.configService.get<string>('TELEGRAM_BOT_TOKEN');
  }

  getTelegramBotUsername(): string {
    return this.configService.get<string>('TELEGRAM_BOT_USERNAME');
  }

  getSiweDomain(): string {
    return this.configService.get<string>('SIWE_DOMAIN');
  }

  getSiweOrigin(): string {
    return this.configService.get<string>('SIWE_ORIGIN');
  }

  getEncryptKey(): string {
    return this.configService.get<string>('ENCRYPT_KEY');
  }

  getEncryptSalt(): string {
    return this.configService.get<string>('ENCRYPT_SALT');
  }
}
