
export enum EnvironmentType {
  development = 'development',
  staging = 'staging',
  test = 'test',
  production = 'production',
}

export class Environment {
  SIGNING_PRIVATE_KEY!: string;

  ENVIRONMENT!: EnvironmentType;

  INFURA_PROJECT_ID!: string;

  API_DOMAIN!: string;

  GITHUB_CLIENT_ID!: string;

  GITHUB_CLIENT_SECRET!: string;

  DISCORD_CLIENT_ID!: string;

  DISCORD_CLIENT_SECRET!: string;

  TWITTER_CLIENT_ID!: string;

  TWITTER_CLIENT_SECRET!: string;

  TELEGRAM_BOT_TOKEN!: string;

  TELEGRAM_BOT_USERNAME!: string;
}
