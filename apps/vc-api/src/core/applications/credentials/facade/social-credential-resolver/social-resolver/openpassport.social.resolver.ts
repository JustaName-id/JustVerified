import { OpenPassportCredential } from 'apps/vc-api/src/core/domain/credentials/openpassport.credential';
import { AbstractSocialResolver } from './abstract.social.resolver';
import { OpenPassportCallback } from './callback/openpassport.callback';
import { GetAuthUrlRequest } from './requests/get-auth-url.request';

export class OpenPassportSocialResolver extends AbstractSocialResolver<
    OpenPassportCallback,
    OpenPassportCredential
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

    async getAuthUrl(authUrlRequest: GetAuthUrlRequest): Promise<string> {
        const state = this.encryptState(authUrlRequest);
        const records = await this.ensManagerService.getRecords({
            ens: authUrlRequest.ens,
            chainId: authUrlRequest.chainId
        });

        const address = records.coins.find((coin) => coin.id === 60)?.value;
        const openpassportStaticPageUrl = this.environmentGetter.getOpenPassportStaticPageUrl();
        return `${openpassportStaticPageUrl}?state=${state}&address=${address}`;
    }

    async extractCredentialSubject(
        params: OpenPassportCallback
    ): Promise<OpenPassportCredential> {
        console.log(params.code);
        console.log("##########################");
        const decodedAttestation = JSON.parse(atob(params.code));
        console.log(decodedAttestation);
        return
    }
}
