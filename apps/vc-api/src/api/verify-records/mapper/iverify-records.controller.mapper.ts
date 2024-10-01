import { VerifyRecordsApiRequest } from '../requests/verify-records.api.request';
import { VerifyRecordsRequest } from '../../../core/applications/verify-records/requests/verify-records.request';
import { VerifyRecordsResponse } from '../../../core/applications/verify-records/response/verify-records.response';
import { VerifyRecordsApiResponse } from '../responses/verify-records.api.response';

export const VERIFY_RECORDS_CONTROLLER_MAPPER = "VERIFY_RECORDS_CONTROLLER_MAPPER";

export interface IVerifyRecordsControllerMapper {
  mapVerifyRecordsApiRequestToVerifyRecordsRequest(
    verifyRecordsApiRequest: VerifyRecordsApiRequest,
  ): VerifyRecordsRequest;

  mapVerifyRecordsResponseToVerifyRecordsApiResponse(
    verifyRecordsResponse: VerifyRecordsResponse
  ): VerifyRecordsApiResponse;
}
