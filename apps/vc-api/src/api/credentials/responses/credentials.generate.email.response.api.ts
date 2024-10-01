import {IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CredentialsGenerateEmailResponseApi {
  @ApiProperty()
  @IsString()
  state: string
}
