import {IsString } from 'class-validator';

export class CredentialsResendOtpRequestApi
{
  @IsString()
  state: string
}
