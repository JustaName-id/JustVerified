import { ApiProperty } from '@nestjs/swagger';

export class VerifyRecordsApiResponse {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'boolean'
    },
    example: {
      record1: true,
      record2: false
    }
  })
  records: { [key: string]: boolean };
}
