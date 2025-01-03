import { OpenPassportAttestation, OpenPassportVerifierReport } from "@openpassport/core";

export const OPENPASSPORT_SERVICE = 'OPENPASSPORT_SERVICE';

export interface IOpenPassportService {
    verify(attestation: OpenPassportAttestation): Promise<OpenPassportVerifierReport>;
}