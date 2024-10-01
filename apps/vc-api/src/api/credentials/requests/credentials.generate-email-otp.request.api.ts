import {IsString } from 'class-validator';

export class CredentialsGenerateEmailOtpApiRequestQuery
{
  @IsString()
  email: string
}
