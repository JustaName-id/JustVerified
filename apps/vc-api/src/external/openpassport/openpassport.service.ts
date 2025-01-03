import { Inject, Injectable } from "@nestjs/common";
import { IOpenPassportService } from "../../core/applications/openpassport/iopenpassport.service";
import { OpenPassportAttestation, OpenPassportVerifier, OpenPassportVerifierReport } from "@openpassport/core";
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from "../../core/applications/environment/ienvironment.getter";

@Injectable()
export class OpenPassportService implements IOpenPassportService {

    private openPassportVerifier: OpenPassportVerifier;

    constructor(
        @Inject(ENVIRONMENT_GETTER) private readonly environmentGetter: IEnvironmentGetter,
    ) {}

    onModuleInit() {
        const environment = this.environmentGetter.getEnv();
        const openPassportScope = this.environmentGetter.getOpenPassportScope()

        this.openPassportVerifier = new OpenPassportVerifier('prove_offchain', openPassportScope);

        if (environment === 'development' || environment === 'staging') {
            this.openPassportVerifier.allowMockPassports();
        }
    }

    verify(attestation: OpenPassportAttestation): Promise<OpenPassportVerifierReport> {
        return this.openPassportVerifier.verify(attestation);
    }
}