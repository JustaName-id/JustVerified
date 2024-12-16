import { Inject } from "@nestjs/common";
import { OpenPassportAttestation } from "@openpassport/core";
import { OpenPassportCredential } from '../../../../../domain/credentials/openpassport.credential';
import { AbstractSocialResolver } from './abstract.social.resolver';
import { OpenPassportCallback } from './callback/openpassport.callback';
import { GetAuthUrlRequest } from './requests/get-auth-url.request';
import { CredentialsException } from '../../../../../domain/exceptions/Credentials.exception';
import { IOpenPassportService, OPENPASSPORT_SERVICE } from "../../../../openpassport/iopenpassport.service";

export class OpenPassportSocialResolver extends AbstractSocialResolver<
OpenPassportCallback,
OpenPassportCredential
> {

    constructor(
        @Inject(OPENPASSPORT_SERVICE) private readonly openPassportService: IOpenPassportService,
    ) {
        super();
    }

    getCredentialName(): string {
        return 'openpassport';
    }

    getKey(): string {
        return 'app.openpassport';
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
        const decryptedState = this.cryptoEncryption.decrypt(params.state);
        const { ens, chainId } = JSON.parse(decryptedState);

        const records = await this.ensManagerService.getRecords({
            ens: ens,
            chainId: chainId
        });

        const addressFromRecords = records.coins.find((coin) => coin.id === 60)?.value;
        const decodedAttestation = JSON.parse(atob(params.code));
        const addressFromAttestation = `0x${decodedAttestation.credentialSubject.userId}`;

        if (addressFromAttestation.toLowerCase() !== addressFromRecords.toLowerCase()) {
            throw CredentialsException.addressMismatch();
        }

        const openPassportProof = {
            proof: decodedAttestation.proof,
            dsc: decodedAttestation.dsc,
            dscProof: decodedAttestation.dscProof
        }

        await this.openPassportService.verify(openPassportProof as OpenPassportAttestation);

        const stringifiedOpenPassportProof = JSON.stringify(openPassportProof);

        return {
            openPassportProof: stringifiedOpenPassportProof
        };
    }
}
