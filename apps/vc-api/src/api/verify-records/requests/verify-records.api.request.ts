import { IsArray, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class VerifyRecordsApiRequest {
  @ApiProperty()
  @IsString()
  subname: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  chainId: number;

  @ApiProperty()
  @IsArray()
  recordsToVerify: string[];
}
