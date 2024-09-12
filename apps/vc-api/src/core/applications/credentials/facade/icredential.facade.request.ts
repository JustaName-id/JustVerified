import {CredentialSubject} from "../../../domain/entities/eip712";

export class ICredentialFacadeRequest {
  credentialName: string;
  credentialSubject: CredentialSubject
}
