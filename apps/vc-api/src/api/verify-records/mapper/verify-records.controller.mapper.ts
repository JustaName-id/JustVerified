import { Injectable } from '@nestjs/common';
import { IVerifyRecordsControllerMapper } from './iverify-records.controller.mapper';
import { VerifyRecordsApiRequest } from '../requests/verify-records.api.request';
import { VerifyRecordsRequest } from '../../../core/applications/verify-records/requests/verify-records.request';
import { VeirfyRecordsResponse } from '../../../core/applications/verify-records/response/verify-records.response';
import { VerifyRecordsApiResponse } from '../responses/verify-records.api.response';

@Injectable()
export class VerifyRecordsControllerMapper implements IVerifyRecordsControllerMapper {
  constructor() {}

  mapVerifyRecordsApiRequestToVerifyRecordsRequest(
    verifyRecordsApiRequest: VerifyRecordsApiRequest,
    issuer: string  // Add issuerName as an additional argument
  ): VerifyRecordsRequest {
    return {
      subname: verifyRecordsApiRequest.subname,
      chainId: verifyRecordsApiRequest.chainId,
      recordsToVerify: verifyRecordsApiRequest.recordsToVerify,
      issuer: issuer
    };
  }

  mapVerifyRecordsResponseToVerifyRecordsApiResponse(verifyRecordsResponses: VeirfyRecordsResponse[]): VerifyRecordsApiResponse[] {
    return verifyRecordsResponses.map(verifyRecordsResponse => ({
      records: {
        ...verifyRecordsResponse
      }
    }));
  }

}
