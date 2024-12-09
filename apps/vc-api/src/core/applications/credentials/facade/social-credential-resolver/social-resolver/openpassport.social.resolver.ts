import { AbstractSocialResolver } from './abstract.social.resolver';
import { GetAuthUrlRequest } from './requests/get-auth-url.request';

export class OpenPassportSocialResolver extends AbstractSocialResolver<
    any,
    any
> {
    getCredentialName(): string {
        return 'openpassport';
    }

    getKey(): string {
        return 'org.openpassport';
    }

    getType(): string[] {
        return ['VerifiableOpenPassportAccount'];
    }
    getAuthUrl(authUrlRequest: GetAuthUrlRequest): string {
        const state = this.encryptState(authUrlRequest);

        const openpassportStaticPageUrl = this.environmentGetter.getOpenPassportStaticPageUrl();

        return `${openpassportStaticPageUrl}?state=${state}`;
    }

    async extractCredentialSubject(
        params: any
    ): Promise<any> {
        return
    }
}
