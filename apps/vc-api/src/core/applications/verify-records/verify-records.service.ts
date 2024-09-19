import { IVerifyRecordsService } from './iverify-records.service';
import { Inject, Injectable } from '@nestjs/common';
import { ISubnameRecordsFetcher, SUBNAME_RECORDS_FETCHER } from './isubname-records.fetcher';
import { VerifyRecordsRequest } from './requests/verify-records.request';
import { VeirfyRecordsResponse } from './response/verify-records.response';
import { Subname } from '../../domain/entities/subname';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../environment/ienvironment.getter';

@Injectable()
export class VerifyRecordsService implements IVerifyRecordsService {
  private chainIdMapping = {
    "mainnet": 1,
    "sepolia": 11155111
  };

  domain: string;
  constructor(
    @Inject(SUBNAME_RECORDS_FETCHER)
    private readonly subnameRecordsFetcher: ISubnameRecordsFetcher,
    @Inject(ENVIRONMENT_GETTER) private readonly environmentGetter: IEnvironmentGetter,
  ) {
    this.domain = this.environmentGetter.getEnsDomain();
  }

  async verifyRecords(verifyRecordsRequest: VerifyRecordsRequest): Promise<VeirfyRecordsResponse[]> {
    const { subname, chainId, recordsToVerify, issuer } = verifyRecordsRequest;

    const validIssuer = issuer ? issuer : this.domain;

    if (chainId !== 1 && chainId !== 11155111) {
      throw new Error('Invalid chainId');
    }

    const subnameRecords = await this.subnameRecordsFetcher.fetchRecords(subname, chainId);

    const responses: VeirfyRecordsResponse[] = [];

      for (const record of recordsToVerify) {
        const response = this._recordVerifier(record, subnameRecords, chainId, validIssuer);
        responses.push(response);
      }

    return responses;
  }

   private _recordVerifier(record: string, subnameRecords: Subname, chainId: number, issuer: string): VeirfyRecordsResponse {
    // 1) check if record exists in subnameRecords, if not return false
     const foundRecord = subnameRecords.metadata.textRecords.find((item) => item.key === record);

     if (!foundRecord) {
       return {
         [record]: false
       }
     }

     // 2) check if record_issuer exists in subnameRecords, if not return false
     const foundRecordIssuer = subnameRecords.metadata.textRecords.find((item) => item.key === `${record}_${issuer}`);

     if (!foundRecordIssuer) {
       return {
         [record]: false
       }
     }

     // 3) parse the value of record_issuer
        const vc = JSON.parse(foundRecordIssuer.value);

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
     if (didSubname !== subnameRecords.subname) {
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
     if (vc.credentialSubject.username !== foundRecord.value) {
       return {
         [record]: false
       };
     }

     return { [record]: true };
  }
}
