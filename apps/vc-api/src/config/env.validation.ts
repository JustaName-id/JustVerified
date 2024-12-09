import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsString,
  registerDecorator,
  validateSync,
  ValidationOptions
} from 'class-validator';
import { ethers } from 'ethers';
import { Environment, EnvironmentType } from '../core/domain/entities/environment';

class EnvironmentVariables implements Environment{
  @IsString({ message: 'SIGNING_PRIVATE_KEY must be a string' })
  @IsEthereumPrivateKey({ message: 'SIGNING_PRIVATE_KEY must be a valid private key' })
  SIGNING_PRIVATE_KEY!: string;

  @IsString({ message: 'SIGNING_PRIVATE_KEY_SEPOLIA_DOMAIN must be a string' })
  @IsEthereumPrivateKey({ message: 'SIGNING_PRIVATE_KEY_SEPOLIA_DOMAIN must be a valid private key' })
  SIGNING_PRIVATE_KEY_SEPOLIA_DOMAIN!: string;

  @IsString({ message: 'ENVIROMENT must be a string' })
  @IsEnum(EnvironmentType, { message: 'ENVIRONMENT must be a valid environment' })
  ENVIRONMENT!: EnvironmentType;

  @IsString({ message: 'ENS_DOMAIN must be a string' })
  ENS_DOMAIN!: string;

  @IsString({ message: 'ENS_DOMAIN_SEPOLIA must be a string' })
  ENS_DOMAIN_SEPOLIA!: string;

  @IsString({message: 'INFURA_PROJECT_ID must be a string'})
  INFURA_PROJECT_ID!: string;

  @IsString({message: 'API_DOMAIN must be a string'})
  API_DOMAIN!: string;

  @IsString({message: 'GITHUB_CLIENT_ID must be a string'})
  GITHUB_CLIENT_ID!: string;

  @IsString({message: 'GITHUB_CLIENT_SECRET must be a string'})
  GITHUB_CLIENT_SECRET!: string;

  @IsString({message: 'DISCORD_CLIENT_ID must be a string'})
  DISCORD_CLIENT_ID!: string;

  @IsString({message: 'DISCORD_CLIENT_SECRET must be a string'})
  DISCORD_CLIENT_SECRET!: string;

  @IsString({message: 'TWITTER_CLIENT_ID must be a string'})
  TWITTER_CLIENT_ID!: string;

  @IsString({message: 'TWITTER_CLIENT_SECRET must be a string'})
  TWITTER_CLIENT_SECRET!: string;

  @IsString({message: 'TELEGRAM_BOT_TOKEN must be a string'})
  TELEGRAM_BOT_TOKEN!: string;

  @IsString({message: 'TELEGRAM_BOT_USERNAME must be a string'})
  TELEGRAM_BOT_USERNAME!: string;

  @IsString({message: 'TELEGRAM_STATIC_PAGE_URL must be a string'})
  TELEGRAM_STATIC_PAGE_URL!: string;

  @IsString({message: 'OPENPASSPORT_STATIC_PAGE_URL must be a string'})
  OPENPASSPORT_STATIC_PAGE_URL!: string;

  @IsString({message: 'JWT_SECRET must be a string'})
  JWT_SECRET: string;

  @IsString({message: 'ENCRYPT_KEY must be a string'})
  ENCRYPT_KEY: string;

  @IsString({message: 'ENCRYPT_SALT must be a string'})
  ENCRYPT_SALT: string;

  @IsString({message: 'RESEND_API_KEY must be a string'})
  RESEND_API_KEY: string;

  @IsString({message: 'ORIGIN must be a string'})
  ORIGIN: string;

  @IsString({message: 'DOMAIN must be a string'})
  DOMAIN: string;
}

function IsEthereumPrivateKey(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsEthereumPrivateKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any) => privateKeyValidator(value),
        defaultMessage: () => `${propertyName} must be a valid private key`,
      },
    });
  };
}
export function privateKeyValidator(pk: string) {
  try {
    const w = new ethers.Wallet(pk);
  } catch (e) {
    return false;
  }

  return true;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
