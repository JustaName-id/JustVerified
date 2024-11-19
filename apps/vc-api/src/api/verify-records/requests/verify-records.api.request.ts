import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ChainId } from '@justaname.id/sdk';
import { Credentials } from '../../../core/domain/entities/credentials';

export class VerifyRecordsApiRequest {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  ens: string[];

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  chainId: ChainId;

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
