import { OTPExceptionFilter } from './credentials/otp.filter';
import { EmailSenderExceptionFilter } from './credentials/email-sender.filter';
import { ChainIdInvalidExceptionFilter } from './verify-records/chainId.invalid.filter';
import { SocialResolverNotFoundExceptionFilter } from './credentials/social-resolver.not-found.filter';
import { CredentialsExceptionFilter } from './credentials/credentials.filter';
import { AuthenticationExceptionFilter } from './auth/authentication.filter';
import { JustaNameInitializerExceptionFilter } from './auth/justaName-intializer.filter';
import { Web3ProviderExceptionFilter } from './web3-provider/web3-provider.filter';

export const VCManagementApiFilters = [
  OTPExceptionFilter,
  EmailSenderExceptionFilter,
  AuthenticationExceptionFilter,
  JustaNameInitializerExceptionFilter,
  ChainIdInvalidExceptionFilter,
  CredentialsExceptionFilter,
  SocialResolverNotFoundExceptionFilter,
  Web3ProviderExceptionFilter,
];
