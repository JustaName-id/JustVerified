export const VERIFY_RECORDS_SERVICE = 'VERIFY_RECORDS_SERVICE';

export interface IVerifyRecordsService {
  verifyRecords(subname: string, recordsToVerify: string[], chainId: number): Promise<void>;
}
