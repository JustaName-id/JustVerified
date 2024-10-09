import { OTPExceptionFilter } from './credentials/otp.filter';
import { EmailSenderExceptionFilter } from './credentials/email-sender.filter';
import { ChainIdInvalidExceptionFilter } from './verify-records/chainId.invalid.filter';
import { SocialResolverNotFoundExceptionFilter } from './credentials/social-resolver.not-found.filter';
import { CredentialsExceptionFilter } from './credentials/credentials.filter';
import { AuthenticationExceptionFilter } from './auth/authentication.filter';
import { JustaNameInitializerExceptionFilter } from './auth/justaName-intializer.filter';

export const VCManagementApiFilters = [
  OTPExceptionFilter,
  EmailSenderExceptionFilter,
  AuthenticationExceptionFilter,
  JustaNameInitializerExceptionFilter,
  ChainIdInvalidExceptionFilter,
  CredentialsExceptionFilter,
  SocialResolverNotFoundExceptionFilter,
];
