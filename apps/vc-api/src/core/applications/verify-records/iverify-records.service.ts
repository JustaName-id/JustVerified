import { VerifyRecordsRequest } from './requests/verify-records.request';
import { VeirfyRecordsResponse } from './response/verify-records.response';

export const VERIFY_RECORDS_SERVICE = 'VERIFY_RECORDS_SERVICE';

export interface IVerifyRecordsService {
  verifyRecords(verifyRecordsRequest: VerifyRecordsRequest): Promise<VeirfyRecordsResponse[]>;
}
