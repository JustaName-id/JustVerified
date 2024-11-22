import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Credentials } from '../../../core/domain/entities/credentials';

export class VerifyRecordsApiRequest {
  @ApiProperty()
  @IsString()
  providerUrl: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  ens: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  credentials: Credentials[];

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  matchStandard?: boolean = false;

  @ApiProperty()
  @IsOptional()
  issuer?: string;
}
