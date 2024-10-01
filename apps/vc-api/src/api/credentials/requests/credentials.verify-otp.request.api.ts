import {IsString } from 'class-validator';

export class CredentialsVerifyOtpRequestApi
{
  @IsString()
  state: string

  @IsString()
  otp: string
}
