import { CredentialSubjectValue } from '../../../../../domain/entities/ethereumEip712Signature';
import { BaseSocialCallback } from './callback/base.social.callback';
import { GetAuthUrlRequest } from './requests/get-auth-url.request';
import {AbstractResolver} from "../../abstract.resolver";

export abstract class AbstractSocialResolver<
  T extends BaseSocialCallback = { state: string },
  K extends CredentialSubjectValue = {}
> extends AbstractResolver<
    T ,
    K
> {

  abstract getCredentialName(): string;

  abstract getAuthUrl(authUrlRequest: GetAuthUrlRequest): Promise<string>;

  getCallbackUrl(): string {
    return `${this.environmentGetter.getApiDomain()}/credentials/socials/${this.getCredentialName()}/callback`;
  }
}
