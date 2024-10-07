import { IVerifyRecordsService } from './iverify-records.service';
import { Inject, Injectable } from '@nestjs/common';
import { ISubnameRecordsFetcher, SUBNAME_RECORDS_FETCHER } from './isubname-records.fetcher';
import { VerifyRecordsRequest } from './requests/verify-records.request';
import { VerifyRecordsResponse } from './response/verify-records.response';
import { Subname } from '../../domain/entities/subname';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../environment/ienvironment.getter';
import {VerifiableEthereumEip712Signature2021} from "../../domain/entities/ethereumEip712Signature";
import {GithubCredential} from "../../domain/credentials/github.credential";
import {TwitterCredential} from "../../domain/credentials/twitter.credential";
import {TelegramCredential} from "../../domain/credentials/telegram.credential";
import {EmailCredential} from "../../domain/credentials/email.credential";
import {DiscordCredential} from "../../domain/credentials/discord.credential";
import { ChainIdInvalidException } from '../../domain/exceptions/ChainIdInvalid.exception';

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

  async verifyRecords(verifyRecordsRequest: VerifyRecordsRequest): Promise<VerifyRecordsResponse> {
    const { ens, chainId, credentials, issuer } = verifyRecordsRequest;

    const validIssuer = issuer ? issuer : this.domain;

    if (chainId !== 1 && chainId !== 11155111) {
      throw ChainIdInvalidException.withId(chainId);
    }

    const subnameRecords = await this.subnameRecordsFetcher.fetchRecords(ens, chainId);

    let responses: VerifyRecordsResponse = {}

      for (const record of credentials) {
        const response = this._recordVerifier(record, subnameRecords, chainId, validIssuer, verifyRecordsRequest.matchStandard);
        responses = { ...responses, ...response };
      }

    return responses;
  }

   private _recordVerifier(record: string, subnameRecords: Subname, chainId: number, issuer: string, matchStandard: boolean): VerifyRecordsResponse {
     // 1) check if record_issuer exists in subnameRecords, if not return false
     const foundRecordIssuer = subnameRecords.metadata.textRecords.find((item) => item.key === `${record}_${issuer}`);
     if (!foundRecordIssuer) {
       return {
         [record]: false
       }
     }

     // 2) parse the value of record_issuer
     const vc = JSON.parse(foundRecordIssuer.value) as VerifiableEthereumEip712Signature2021;
     // 3) check the expirationDate, if expired return false
     const currentDate = new Date();
     const expirationDate = new Date(vc.expirationDate);
     if (expirationDate < currentDate) {
       return {
         [record]: false
       };
     }
     // 4) check if it belongs to the subname, if not return false
     const didSubnameWithFragment = vc.credentialSubject.did.split(':')[3];
     const didSubname = didSubnameWithFragment.split('#')[0];

     if (didSubname !== subnameRecords.subname) {
       return {
         [record]: false
       };
     }

     // 5) check the issuer did, if not return false
     const issuerDid = vc.issuer.id.split(':');
     const issuerChain = issuerDid[2];
     const issuerNameFragment = issuerDid[3];
     const issuerName = issuerNameFragment.split('#')[0];

     if (issuerName !== issuer || this.chainIdMapping[issuerChain] !== chainId) {
       return {
         [record]: false
       };
     }

     // 6) check if it's on the correct chain, if not return false (for both the issuer did and credential subject did, and the chainId in the proof)
     const subjectDid = vc.credentialSubject.did.split(':');
     const subjectChain = subjectDid[2]; // Extract chain from DID
     if (this.chainIdMapping[subjectChain] !== chainId || Number(vc.proof.eip712.domain.chainId) !== chainId) {
       return {
         [record]: false
       };
     }

     const typedVc = vc as VerifiableEthereumEip712Signature2021;

     const type = typedVc.type[1];

     let handle = "";

     switch (type) {
        case 'VerifiableTwitterAccount':
          handle = (typedVc as VerifiableEthereumEip712Signature2021<TwitterCredential>).credentialSubject.username;
          break;
        case 'VerifiableGithubAccount':
          handle = (typedVc as VerifiableEthereumEip712Signature2021<GithubCredential>).credentialSubject.username;
          break;
        case 'VerifiableTelegramAccount':
          handle = (typedVc as VerifiableEthereumEip712Signature2021<TelegramCredential>).credentialSubject.username;
          break;
        case 'VerifiableEmailAddress':
          handle = (typedVc as VerifiableEthereumEip712Signature2021<EmailCredential>).credentialSubject.email;
          break;
        case 'VerifiableDiscordAccount':
          handle = (typedVc as VerifiableEthereumEip712Signature2021<DiscordCredential>).credentialSubject.username;
          break
        default:
          break;
     }

     // 7) check that the value of the username of the credentialSubject matches the value of the record inside the subnameRecords, if not return false
     if(matchStandard) {
       const foundRecord = subnameRecords.metadata.textRecords.find((item) => item.key === record);

       if (!foundRecord) {
         return {
           [record]: false
         }
       }

       if (handle !== foundRecord.value) {
         return {
           [record]: false
         };
       }
     }

     return { [record]: true };
  }
}
