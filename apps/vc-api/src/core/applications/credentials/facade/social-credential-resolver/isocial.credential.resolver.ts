import {AbstractSocialResolver} from "./social-resolver/abstract.social.resolver";

export const SOCIAL_CREDENTIAL_RESOLVER = 'SOCIAL_CREDENTIAL_RESOLVER';

export interface ISocialCredentialResolver {
  getSocialResolvers(): AbstractSocialResolver[];
}
