import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import {
  IVerifyRecordsService,
  VERIFY_RECORDS_SERVICE
} from '../../core/applications/verify-records/iverify-records.service';
import { VerifyRecordsApiRequest } from './requests/verify-records.api.request';
import { IVerifyRecordsControllerMapper } from './mapper/iverify-records.controller.mapper';
import {VerifyRecordsApiResponse} from "./responses/verify-records.api.response";

@Controller('verify-records')
export class VerifyRecordsController {

  constructor(
    @Inject(VERIFY_RECORDS_SERVICE) private readonly verifyRecordsService: IVerifyRecordsService,
    @Inject('VERIFY_RECORDS_CONTROLLER_MAPPER') private readonly verifyRecordsControllerMapper: IVerifyRecordsControllerMapper
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

    return this.verifyRecordsControllerMapper.mapVerifyRecordsResponseToVerifyRecordsApiResponse(response);
  }
}
