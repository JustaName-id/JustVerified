import { OTPExceptionFilter } from './credentials/otp.filter';
import { EmailSenderExceptionFilter } from './credentials/email-sender.filter';
import { ChainIdInvalidExceptionFilter } from './verify-records/chainId.invalid.filter';
import { SocialResolverNotFoundExceptionFilter } from './credentials/social-resolver.not-found.filter';
import { CredentialsInvalidExceptionFilter } from './credentials/credentials.invalid.filter';
import { AuthenticationExceptionFilter } from './auth/authentication.filter';

export const VCManagementApiFilters = [
  OTPExceptionFilter,
  EmailSenderExceptionFilter,
  AuthenticationExceptionFilter,
  ChainIdInvalidExceptionFilter,
  CredentialsInvalidExceptionFilter,
  SocialResolverNotFoundExceptionFilter,
];
