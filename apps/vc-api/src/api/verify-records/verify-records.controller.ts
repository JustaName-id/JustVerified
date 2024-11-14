import { Controller, Get, Inject, Query } from '@nestjs/common';
import { VerifyRecordsApiRequest } from './requests/verify-records.api.request';
import { VerifyRecordsApiResponse } from './responses/verify-records.api.response';
import {
  IVerifyRecordsService,
  VERIFY_RECORDS_SERVICE,
} from '../../core/applications/verify-records/iverify-records.service';
import {
  IVerifyRecordsControllerMapper,
  VERIFY_RECORDS_CONTROLLER_MAPPER,
} from './mapper/iverify-records.controller.mapper';

@Controller('verify-records')
export class VerifyRecordsController {
  constructor(
    @Inject(VERIFY_RECORDS_SERVICE)
    private readonly verifyRecordsService: IVerifyRecordsService,
    @Inject(VERIFY_RECORDS_CONTROLLER_MAPPER)
    private readonly verifyRecordsControllerMapper: IVerifyRecordsControllerMapper
  ) {}

  @Get('')
  async verifyRecords(
    @Query() query: VerifyRecordsApiRequest
  ): Promise<VerifyRecordsApiResponse> {
    const response = await this.verifyRecordsService.verifyRecords(
      this.verifyRecordsControllerMapper.mapVerifyRecordsApiRequestToVerifyRecordsRequest(
        query
      )
    );

    return this.verifyRecordsControllerMapper.mapVerifyRecordsResponseToVerifyRecordsApiResponse(
      response
    );
  }
}
