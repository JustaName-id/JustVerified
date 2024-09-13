import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum AuthName {
  Twitter = 'twitter',
  Github = 'github',
  Discord = 'discord',
  Telegram = 'telegram',
}

export class AuthGetAuthUrlRequestApiRequestParam
{
  @IsNotEmpty()
  @IsEnum(AuthName)
  authName: AuthName
}

export class AuthGetAuthUrlApiRequestQuery
{
  @IsOptional()
  @IsString()
  code?: string;
}
