import { IVerifyRecordsService } from './iverify-records.service';
import { Inject, Injectable } from '@nestjs/common';
import { ISubnameRecordsFetcher } from './isubname-records.fetcher';

@Injectable()
export class VerifyRecordsService implements IVerifyRecordsService {
  constructor(
    @Inject('SUBNAME_RECORDS_FETCHER')
    private readonly subnameRecordsFetcher: ISubnameRecordsFetcher
  ) {}

  async verifyRecords(subname: string, recordsToVerify: string[], chainId: number): Promise<void> {
    if (chainId !== 1 && chainId !== 11155111) {
      throw new Error('Invalid chainId');
    }

    const subnameRecords = await this.subnameRecordsFetcher.fetchRecords(subname, chainId);

  }
}
