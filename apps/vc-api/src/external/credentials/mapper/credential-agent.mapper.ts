import {ICredentialAgentMapper} from "./icredential-agent.mapper";
import {EthereumEip712Signature2021, VerifiableEthereumEip712Signature2021} from "../../../core/domain/entities/ethereumEip712Signature";
import {VerifiableCredential} from "@veramo/core";
import {ICreateVerifiableCredentialEIP712Args} from "@veramo/credential-eip712";

export class CredentialAgentMapper implements ICredentialAgentMapper {
  mapVerifiedEthereumEip721Signature2021ToVeramoVerifiedCredential(verifiedEthereumEip712Signature2021: VerifiableEthereumEip712Signature2021): VerifiableCredential {
    return {
      issuanceDate: new Date(verifiedEthereumEip712Signature2021.issuanceDate).toISOString(),
      expirationDate: new Date(verifiedEthereumEip712Signature2021.expirationDate).toISOString(),
      "@context": verifiedEthereumEip712Signature2021["@context"],
      type: verifiedEthereumEip712Signature2021.type,
      credentialSubject: verifiedEthereumEip712Signature2021.credentialSubject,
      issuer: verifiedEthereumEip712Signature2021.issuer,
      proof: verifiedEthereumEip712Signature2021.proof
    }
  }

  mapVeramoVerifiedCredentialToVerifiedEthereumEip721Signature2021(verifiedCredential: VerifiableCredential): VerifiableEthereumEip712Signature2021 {
    return {
      "@context": verifiedCredential["@context"],
      type: verifiedCredential.type,
      credentialSubject: {
        did: verifiedCredential.credentialSubject.id,
        ...verifiedCredential.credentialSubject
      },
      issuer: {
        id: typeof verifiedCredential.issuer === 'string' ? verifiedCredential.issuer : verifiedCredential.issuer.id
      },
      issuanceDate: new Date(verifiedCredential.issuanceDate),
      expirationDate: new Date(verifiedCredential.expirationDate),
      proof: {
        type: verifiedCredential.proof.type,
        created: new Date(verifiedCredential.proof.created),
        verificationMethod: verifiedCredential.proof.verificationMethod,
        proofPurpose: verifiedCredential.proof.proofPurpose,
        proofValue: verifiedCredential.proof.proofValue,
        eip712: verifiedCredential.proof.eip712
      }
    }
  }

  mapEthereumEip712Signature2021ToVeramoICreateVerifiableCredentialEIP712Args(issuerId: string,ethereumEip712Signature2021: EthereumEip712Signature2021): ICreateVerifiableCredentialEIP712Args {
    return {
      credential: {
        "@context": ethereumEip712Signature2021["@context"],
        type: typeof ethereumEip712Signature2021.type === 'string' ? [ethereumEip712Signature2021.type] : ethereumEip712Signature2021.type,
        credentialSubject: ethereumEip712Signature2021.credentialSubject,
        issuer: {
          id: issuerId
        },
        issuanceDate: ethereumEip712Signature2021.issuanceDate,
        expirationDate: ethereumEip712Signature2021.expirationDate,
      }
    }
  }
}
