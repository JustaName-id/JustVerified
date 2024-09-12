import { VerifiableCredential} from "@veramo/core";
import {ICreateVerifiableCredentialEIP712Args} from "@veramo/credential-eip712";
import { EthereumEip712Signature2021, VerifiedEthereumEip712Signature2021 } from '../../../core/domain/entities/eip712';

export const CREDENTIAL_AGENT_MAPPER = 'CREDENTIAL_AGENT_MAPPER';


export interface ICredentialAgentMapper {
  mapEthereumEip712Signature2021ToVeramoICreateVerifiableCredentialEIP712Args(
    issuerId: string,
    ethereumEip712Signature2021: EthereumEip712Signature2021): ICreateVerifiableCredentialEIP712Args
  mapVeramoVerifiedCredentialToVerifiedEthereumEip721Signature2021(verifiedCredential: VerifiableCredential): VerifiedEthereumEip712Signature2021
  mapVerifiedEthereumEip721Signature2021ToVeramoVerifiedCredential(
    verifiedEthereumEip712Signature2021: VerifiedEthereumEip712Signature2021): VerifiableCredential
}
