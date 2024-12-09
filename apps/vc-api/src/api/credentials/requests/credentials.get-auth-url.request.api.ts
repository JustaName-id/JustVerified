import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum AuthName {
  Twitter = 'twitter',
  Github = 'github',
  Discord = 'discord',
  Telegram = 'telegram',
  OpenPassport = 'openpassport',
}

export class CredentialsGetAuthUrlRequestApiRequestParam
{
  @IsNotEmpty()
  @IsEnum(AuthName)
  authName: AuthName
}

export class CredentialsGetAuthUrlApiRequestQuery
{
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  state: string
}
