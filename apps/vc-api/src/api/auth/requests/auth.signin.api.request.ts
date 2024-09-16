import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSigninApiRequest {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  signature: string;
}
