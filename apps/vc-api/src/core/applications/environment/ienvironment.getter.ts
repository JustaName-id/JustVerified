import { ChainId, EnvironmentType } from '../../domain/entities/environment';

export const ENVIRONMENT_GETTER = 'ENVIRONMENT_GETTER'

export interface IEnvironmentGetter {
  getPk(): string;
  getEnv(): EnvironmentType;
  getEnsDomain(): string;
  getSiweDomain(): string;
  getSiweOrigin(): string;
  getChainId(): ChainId
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
  getEncryptKey(): string;
  getEncryptSalt(): string;
}
