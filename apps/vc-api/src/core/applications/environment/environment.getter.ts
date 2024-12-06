import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IEnvironmentGetter} from "./ienvironment.getter";
import { Environment, EnvironmentType } from '../../domain/entities/environment';

@Injectable()
export class EnvironmentGetter implements IEnvironmentGetter {
  constructor(private readonly configService: ConfigService<Environment>) {}

  getPk(): string {
    return this.configService.get('SIGNING_PRIVATE_KEY');
  }

  getPkSepolia(): string {
    return this.configService.get('SIGNING_PRIVATE_KEY_SEPOLIA_DOMAIN');
  }

  getEnv(): EnvironmentType {
    return this.configService.get<EnvironmentType>('ENVIRONMENT');
  }

  getEnsDomain(): string {
    return this.configService.get<string>('ENS_DOMAIN');
  }

  getEnsDomainSepolia(): string {
    return this.configService.get<string>('ENS_DOMAIN_SEPOLIA');
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

  getTelegramStaticPageUrl(): string {
    return this.configService.get<string>('TELEGRAM_STATIC_PAGE_URL');
  }

  getOpenPassportStaticPageUrl(): string {
    return this.configService.get<string>('OPENPASSPORT_STATIC_PAGE_URL');
  }

  getEncryptKey(): string {
    return this.configService.get<string>('ENCRYPT_KEY');
  }

  getEncryptSalt(): string {
    return this.configService.get<string>('ENCRYPT_SALT');
  }

  getResendApiKey(): string {
    return this.configService.get<string>('RESEND_API_KEY');
  }

  getOrigin(): string {
    return this.configService.get<string>('ORIGIN');
  }

  getDomain(): string {
    return this.configService.get<string>('DOMAIN');
  }
}
