import { EnvironmentType } from '../../domain/entities/environment';

export const ENVIRONMENT_GETTER = 'ENVIRONMENT_GETTER'

export interface IEnvironmentGetter {
  getPk(): string;
  getPkSepolia(): string;
  getEnv(): EnvironmentType;
  getEnsDomain(): string;
  getEnsDomainSepolia(): string;
  getApiDomain(): string;
  getInfuraProjectId(): string;
  getGithubClientId(): string;
  getGithubClientSecret(): string;
  getDiscordClientId(): string;
  getDiscordClientSecret(): string;
  getTwitterClientId(): string;
  getTwitterClientSecret(): string;
  getTelegramBotToken(): string;
  getTelegramBotUsername(): string;
  getTelegramStaticPageUrl(): string;
  getOpenPassportStaticPageUrl(): string;
  getEncryptKey(): string;
  getEncryptSalt(): string;
  getResendApiKey(): string;
  getOrigin(): string;
  getDomain(): string;
}
