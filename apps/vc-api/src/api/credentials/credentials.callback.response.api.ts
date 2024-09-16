import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import { IsString, IsDate, IsArray, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export type PrimitiveValueApiResponse = string | number | boolean | null;

export type CredentialSubjectValueApiResponse = Record<string, PrimitiveValueApiResponse>;


export class CredentialSubjectElementApiResponse {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string;
}

@ApiExtraModels(CredentialSubjectElementApiResponse)
export class TypesApiResponse {
  @ApiProperty({ type: [CredentialSubjectElementApiResponse] })
  @ValidateNested({ each: true })
  @Type(() => CredentialSubjectElementApiResponse)
  EIP712Domain: CredentialSubjectElementApiResponse[];

  @ApiProperty({ type: [CredentialSubjectElementApiResponse] })
  @ValidateNested({ each: true })
  @Type(() => CredentialSubjectElementApiResponse)
  CredentialSubject: CredentialSubjectElementApiResponse[];

  @ApiProperty({ type: [CredentialSubjectElementApiResponse] })
  @ValidateNested({ each: true })
  @Type(() => CredentialSubjectElementApiResponse)
  Issuer: CredentialSubjectElementApiResponse[];

  @ApiProperty({ type: [CredentialSubjectElementApiResponse] })
  @ValidateNested({ each: true })
  @Type(() => CredentialSubjectElementApiResponse)
  Proof: CredentialSubjectElementApiResponse[];

  @ApiProperty({ type: [CredentialSubjectElementApiResponse] })
  @ValidateNested({ each: true })
  @Type(() => CredentialSubjectElementApiResponse)
  VerifiableCredential: CredentialSubjectElementApiResponse[];

}


export class CredentialSubjectApiResponse {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;
}

export class IssuerApiResponse {
  @ApiProperty()
  @IsString()
  id: string;

}



export class DomainApiResponse {
  @ApiProperty()
  chainId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  version: string;

}

@ApiExtraModels(DomainApiResponse, TypesApiResponse)
export class Eip712ApiResponse {
  @ApiProperty({ type: DomainApiResponse })
  @ValidateNested()
  @Type(() => DomainApiResponse)
  domain: DomainApiResponse;

  @ApiProperty({ type: TypesApiResponse })
  @ValidateNested()
  @Type(() => TypesApiResponse)
  types: TypesApiResponse;

  @ApiProperty()
  @IsString()
  primaryType: string;

}

@ApiExtraModels(Eip712ApiResponse)
export class ProofApiResponse {
  @ApiProperty()
  @IsString()
  verificationMethod: string;

  @ApiProperty()
  @IsDate()
  created: Date;

  @ApiProperty()
  @IsString()
  proofPurpose: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  proofValue: string;

  @ApiProperty({ type: Eip712ApiResponse })
  @ValidateNested()
  @Type(() => Eip712ApiResponse)
  eip712: Eip712ApiResponse;
}

@ApiExtraModels(CredentialSubjectApiResponse)
/* eslint-disable @typescript-eslint/ban-types */
export class EthereumEip712Signature2021ApiResponse<T extends CredentialSubjectValueApiResponse = {}> {
  @ApiProperty({ type: CredentialSubjectApiResponse })
  @ValidateNested()
  @Type(() => CredentialSubjectApiResponse)
  credentialSubject: CredentialSubjectApiResponse & T;

  @ApiProperty()
  @IsDate()
  issuanceDate: Date;

  @ApiProperty()
  @IsDate()
  expirationDate: Date;

  @ApiProperty()
  @IsArray()
  "@context": string | Record<string, any> | (string | Record<string, any>)[];

  @ApiProperty()
  @IsArray()
  type: string[] | string;

}

@ApiExtraModels(ProofApiResponse, IssuerApiResponse)
/* eslint-disable @typescript-eslint/ban-types */
export class VerifiedEthereumEip712Signature2021ApiResponse<T extends CredentialSubjectValueApiResponse = {}> extends EthereumEip712Signature2021ApiResponse<T> {
  @ApiProperty({ type: ProofApiResponse })
  @ValidateNested()
  @Type(() => ProofApiResponse)
  proof: ProofApiResponse;

  @ApiProperty({ type: IssuerApiResponse })
  @ValidateNested()
  @Type(() => IssuerApiResponse)
  issuer: IssuerApiResponse;

}


@ApiExtraModels(VerifiedEthereumEip712Signature2021ApiResponse)
export class AuthCallbackApiResponse {

  @ApiProperty()
  @IsString()
  dataKey: string;

  @ApiProperty({ type: VerifiedEthereumEip712Signature2021ApiResponse })
  @ValidateNested()
  @Type(() => VerifiedEthereumEip712Signature2021ApiResponse)
  verifiedCredential: VerifiedEthereumEip712Signature2021ApiResponse;
}
