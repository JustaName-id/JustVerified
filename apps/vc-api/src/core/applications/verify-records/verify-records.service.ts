import { IVerifyRecordsService } from './iverify-records.service';
import { Inject, Injectable } from '@nestjs/common';
import { ISubnameRecordsFetcher, SUBNAME_RECORDS_FETCHER } from './isubname-records.fetcher';
import { VerifyRecordsRequest } from './requests/verify-records.request';
import { VeirfyRecordsResponse } from './response/verify-records.response';
import { Subname } from '../../domain/entities/subname';

@Injectable()
export class VerifyRecordsService implements IVerifyRecordsService {
  private chainIdMapping = {
    "mainnet": 1,
    "sepolia": 11155111
  };

  constructor(
    @Inject(SUBNAME_RECORDS_FETCHER)
    private readonly subnameRecordsFetcher: ISubnameRecordsFetcher,
  ) {}

  async verifyRecords(verifyRecordsRequest: VerifyRecordsRequest): Promise<VeirfyRecordsResponse[]> {
    const { subname, chainId, recordsToVerify, issuer } = verifyRecordsRequest;

    if (chainId !== 1 && chainId !== 11155111) {
      throw new Error('Invalid chainId');
    }

    const subnameRecords = await this.subnameRecordsFetcher.fetchRecords(subname, chainId);

    const responses: VeirfyRecordsResponse[] = [];

      for (const record of recordsToVerify) {
        const response = this._recordVerifier(subname, record, subnameRecords, chainId, issuer);
        responses.push(response);
      }

    return responses;
  }

   private _recordVerifier(subname: string, record: string, subnameRecords: Subname, chainId: number, issuer: string): VeirfyRecordsResponse {
     // 1) check if record exists in subnameRecords, if not return false
     if (!subnameRecords.metadata.textRecords[record]) {
       return {
         [record]: false
       }
     }
     // 2) check if record_verifier.id exists in subnameRecords, if not return false
     if (!subnameRecords.metadata.textRecords[`${record}_${issuer}`]) {
       return {
         [record]: false
       }
     }
     // 3) parse the value of record_verifier.id
        const vc = JSON.parse(subnameRecords.metadata.textRecords[`${record}_${issuer}`].value);

     // 4) check the expirationDate, if expired return false
     const currentDate = new Date();
     const expirationDate = new Date(vc.expirationDate);
     if (expirationDate < currentDate) {
       return {
         [record]: false
       };
     }
     // 5) check if it belongs to the subname, if not return false
     const didSubname = vc.credentialSubject.did.split(':')[3];
     if (didSubname !== subname) {
       return {
         [record]: false
       };
     }
     // 6) check the issuer did, if not return false
     const issuerDid = vc.issuer.id.split(':');
     const issuerChain = issuerDid[2]; // Extract chain from DID
     const issuerName = issuerDid[3]; // Extract subname
     if (issuerName !== issuer || this.chainIdMapping[issuerChain] !== chainId) {
       return {
         [record]: false
       };
     }
     // 7) check if it's on the correct chain, if not return false (for both the issuer did and credential subject did, and the chainId in the proof)
     const subjectDid = vc.credentialSubject.did.split(':');
     const subjectChain = subjectDid[2]; // Extract chain from DID
     if (this.chainIdMapping[subjectChain] !== chainId || Number(vc.proof.eip712.domain.chainId) !== chainId) {
       return {
         [record]: false
       };
     }
     // 8) check that the value of the username of the credentialSubject matches the value of the record inside the subnameRecords, if not return false
     if (vc.credentialSubject.username !== subnameRecords.metadata.textRecords[record]) {
       return {
         [record]: false
       };
     }

     return { [record]: true };
  }
}
