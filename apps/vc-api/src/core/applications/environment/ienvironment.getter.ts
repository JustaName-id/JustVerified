import {EnvironmentType} from "../../domain/entities/environment";

export const ENVIRONMENT_GETTER = 'ENVIRONMENT_GETTER'

export interface IEnvironmentGetter {
  getPk(): string;
  getEnv(): EnvironmentType;
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
}
