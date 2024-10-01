import { ApiResponseProperty, ApiExtraModels } from '@nestjs/swagger';
import { IsString, IsDate, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export type PrimitiveValueApiResponse = string | number | boolean | null;

export type CredentialSubjectValueApiResponse = Record<string, PrimitiveValueApiResponse>;


export class CredentialSubjectElementApiResponse {
  @ApiResponseProperty()
  @IsString()
  name: string;

  @ApiResponseProperty()
  @IsString()
  type: string;
}

@ApiExtraModels(CredentialSubjectElementApiResponse)
export class TypesApiResponse {
  @ApiResponseProperty({ type: [CredentialSubjectElementApiResponse] })
  @ValidateNested({ each: true })
  @Type(() => CredentialSubjectElementApiResponse)
  EIP712Domain: CredentialSubjectElementApiResponse[];

  @ApiResponseProperty({ type: [CredentialSubjectElementApiResponse] })
  @ValidateNested({ each: true })
  @Type(() => CredentialSubjectElementApiResponse)
  CredentialSubject: CredentialSubjectElementApiResponse[];

  @ApiResponseProperty({ type: [CredentialSubjectElementApiResponse] })
  @ValidateNested({ each: true })
  @Type(() => CredentialSubjectElementApiResponse)
  Issuer: CredentialSubjectElementApiResponse[];

  @ApiResponseProperty({ type: [CredentialSubjectElementApiResponse] })
  @ValidateNested({ each: true })
  @Type(() => CredentialSubjectElementApiResponse)
  Proof: CredentialSubjectElementApiResponse[];

  @ApiResponseProperty({ type: [CredentialSubjectElementApiResponse] })
  @ValidateNested({ each: true })
  @Type(() => CredentialSubjectElementApiResponse)
  VerifiableCredential: CredentialSubjectElementApiResponse[];

}


export class CredentialSubjectApiResponse {
  @ApiResponseProperty()
  @IsOptional()
  @IsString()
  id?: string;
}

export class IssuerApiResponse {
  @ApiResponseProperty()
  @IsString()
  id: string;

}



export class DomainApiResponse {
  @ApiResponseProperty()
  chainId: number;

  @ApiResponseProperty()
  @IsString()
  name: string;

  @ApiResponseProperty()
  @IsString()
  version: string;

}

@ApiExtraModels(DomainApiResponse, TypesApiResponse)
export class Eip712ApiResponse {
  @ApiResponseProperty({ type: DomainApiResponse })
  @ValidateNested()
  @Type(() => DomainApiResponse)
  domain: DomainApiResponse;

  @ApiResponseProperty({ type: TypesApiResponse })
  @ValidateNested()
  @Type(() => TypesApiResponse)
  types: TypesApiResponse;

  @ApiResponseProperty()
  @IsString()
  primaryType: string;

}

@ApiExtraModels(Eip712ApiResponse)
export class ProofApiResponse {
  @ApiResponseProperty()
  @IsString()
  verificationMethod: string;

  @ApiResponseProperty()
  @IsDate()
  created: Date;

  @ApiResponseProperty()
  @IsString()
  proofPurpose: string;

  @ApiResponseProperty()
  @IsString()
  type: string;

  @ApiResponseProperty()
  @IsString()
  proofValue: string;

  @ApiResponseProperty({ type: Eip712ApiResponse })
  @ValidateNested()
  @Type(() => Eip712ApiResponse)
  eip712: Eip712ApiResponse;
}

@ApiExtraModels(CredentialSubjectApiResponse)
export class EthereumEip712Signature2021ApiResponse<T extends CredentialSubjectValueApiResponse = {}> {
  @ApiResponseProperty({ type: CredentialSubjectApiResponse })
  @ValidateNested()
  @Type(() => CredentialSubjectApiResponse)
  credentialSubject: CredentialSubjectApiResponse & T;

  @ApiResponseProperty()
  @IsDate()
  issuanceDate: Date;

  @ApiResponseProperty()
  @IsDate()
  expirationDate: Date;

  @ApiResponseProperty()
  @IsArray()
  "@context": string | Record<string, any> | (string | Record<string, any>)[];

  @ApiResponseProperty()
  @IsArray()
  type: string[] | string;

}

@ApiExtraModels(ProofApiResponse, IssuerApiResponse)
export class VerifiedEthereumEip712Signature2021ApiResponse<T extends CredentialSubjectValueApiResponse = {}> extends EthereumEip712Signature2021ApiResponse<T> {
  @ApiResponseProperty({ type: ProofApiResponse })
  @ValidateNested()
  @Type(() => ProofApiResponse)
  proof: ProofApiResponse;

  @ApiResponseProperty({ type: IssuerApiResponse })
  @ValidateNested()
  @Type(() => IssuerApiResponse)
  issuer: IssuerApiResponse;

}


@ApiExtraModels(VerifiedEthereumEip712Signature2021ApiResponse)
export class AuthCallbackApiResponse {

  @ApiResponseProperty()
  @IsString()
  dataKey: string;

  @ApiResponseProperty({ type: VerifiedEthereumEip712Signature2021ApiResponse })
  @ValidateNested()
  @Type(() => VerifiedEthereumEip712Signature2021ApiResponse)
  verifiedCredential: VerifiedEthereumEip712Signature2021ApiResponse;
}
