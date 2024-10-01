import {IsString } from 'class-validator';

export class CredentialsClearEmailRequestApi
{
  @IsString()
  state: string
}
