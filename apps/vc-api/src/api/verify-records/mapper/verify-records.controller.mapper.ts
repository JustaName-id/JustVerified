import { Injectable } from '@nestjs/common';
import { IVerifyRecordsControllerMapper } from './iverify-records.controller.mapper';
import { VerifyRecordsApiRequest } from '../requests/verify-records.api.request';
import { VerifyRecordsRequest } from '../../../core/applications/verify-records/requests/verify-records.request';
import { VerifyRecordsResponse } from '../../../core/applications/verify-records/response/verify-records.response';
import { VerifyRecordsApiResponse } from '../responses/verify-records.api.response';

@Injectable()
export class VerifyRecordsControllerMapper implements IVerifyRecordsControllerMapper {
  constructor() {}

  mapVerifyRecordsApiRequestToVerifyRecordsRequest(
    verifyRecordsApiRequest: VerifyRecordsApiRequest,
  ): VerifyRecordsRequest {
    return {
      providerUrl: verifyRecordsApiRequest.providerUrl,
      ens: verifyRecordsApiRequest.ens,
      credentials: verifyRecordsApiRequest.credentials,
      issuer: verifyRecordsApiRequest.issuer,
      matchStandard: verifyRecordsApiRequest.matchStandard
    };
  }

  mapVerifyRecordsResponsesToVerifyRecordsApiResponses(verifyRecordsResponses: VerifyRecordsResponse[]): VerifyRecordsApiResponse[] {
    return verifyRecordsResponses.map((response) => {
      return {
        ens: response.subname,
        records: response.records
      };
    });
  }
}
