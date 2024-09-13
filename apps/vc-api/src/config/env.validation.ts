import { plainToClass, Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber, IsNumberString,
  IsString,
  registerDecorator,
  validateSync,
  ValidationOptions
} from 'class-validator';
import { ethers } from 'ethers';
import { ChainId, Environment, EnvironmentType, SupportedChainIds } from '../core/domain/entities/environment';

class EnvironmentVariables implements Environment{
  @IsString({ message: 'SIGNING_PRIVATE_KEY must be a string' })
  @IsEthereumPrivateKey({ message: 'SIGNING_PRIVATE_KEY must be a valid private key' })
  SIGNING_PRIVATE_KEY!: string;

  @IsString({ message: 'ENVIROMENT must be a string' })
  @IsEnum(EnvironmentType, { message: 'ENVIRONMENT must be a valid environment' })
  ENVIRONMENT!: EnvironmentType;

  @Transform(({ value }) => {
      const intValue = parseInt(value)
      if (isNaN(intValue)) {
        throw new Error('CHAIN_ID must be a number')
      }

      const isValidChainId = (x: any): x is ChainId => SupportedChainIds.includes(x);

      if (!isValidChainId(intValue)) {
        throw new Error('CHAIN_ID must be a valid chain id (1, 11155111)')
      }
  })
  CHAIN_ID!: ChainId;

  @IsString({ message: 'ENS_DOMAIN must be a string' })
  ENS_DOMAIN!: string;

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
