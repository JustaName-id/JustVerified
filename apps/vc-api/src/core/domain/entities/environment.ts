
export enum EnvironmentType {
  development = 'development',
  staging = 'staging',
  test = 'test',
  production = 'production',
}

export const SupportedChainIds = [1,11155111] as const;

export type ChainId = typeof SupportedChainIds[number];

export class Environment {
  SIGNING_PRIVATE_KEY!: string;

  SIGNING_PRIVATE_KEY_SEPOLIA_DOMAIN!: string;

  ENVIRONMENT!: EnvironmentType;

  ENS_DOMAIN!: string;

  ENS_DOMAIN_SEPOLIA!: string;

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

  JWT_SECRET!: string;

  ENCRYPT_KEY!: string;

  ENCRYPT_SALT!: string;

  RESEND_API_KEY!: string;

  ORIGIN!: string;

  DOMAIN!: string;
}
