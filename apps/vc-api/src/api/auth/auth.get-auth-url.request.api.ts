import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum AuthName {
  Twitter = 'twitter',
  Github = 'github',
  Discord = 'discord',
  Telegram = 'telegram',
}

export class AuthGetAuthUrlRequestApi
{
  @IsNotEmpty()
  @IsEnum(AuthName)
  authName: AuthName
}

export class AuthGetAuthUrlRequestQueryApi
{
  @IsOptional()
  @IsString()
  code?: string;
}
