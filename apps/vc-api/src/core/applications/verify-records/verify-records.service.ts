import { IVerifyRecordsService } from './iverify-records.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  ISubnameRecordsFetcher,
  SUBNAME_RECORDS_FETCHER,
} from './isubname-records.fetcher';
import { VerifyRecordsRequest } from './requests/verify-records.request';
import { VerifyRecordsResponse } from './response/verify-records.response';
import { Subname } from '../../domain/entities/subname';
import {
  ENVIRONMENT_GETTER,
  IEnvironmentGetter,
} from '../environment/ienvironment.getter';
import { VerifiableEthereumEip712Signature2021 } from '../../domain/entities/ethereumEip712Signature';
import { GithubCredential } from '../../domain/credentials/github.credential';
import { TwitterCredential } from '../../domain/credentials/twitter.credential';
import { TelegramCredential } from '../../domain/credentials/telegram.credential';
import { EmailCredential } from '../../domain/credentials/email.credential';
import { DiscordCredential } from '../../domain/credentials/discord.credential';
import { ChainIdInvalidException } from '../../domain/exceptions/ChainIdInvalid.exception';
import {
  FETCH_CHAIN_ID_SERVICE,
  IFetchChainIdService,
} from '../provider-services/ifetch-chain-id.service';
import {
  CREDENTIAL_CREATOR,
  ICredentialCreator,
} from '../credentials/creator/icredential.creator';
import { ChainId } from '@justaname.id/sdk';

@Injectable()
export class VerifyRecordsService implements IVerifyRecordsService {
  private chainIdMapping = {
    mainnet: 1,
    sepolia: 11155111,
  };

  domain: string;
  constructor(
    @Inject(SUBNAME_RECORDS_FETCHER)
    private readonly subnameRecordsFetcher: ISubnameRecordsFetcher,
    @Inject(ENVIRONMENT_GETTER)
    private readonly environmentGetter: IEnvironmentGetter,
    @Inject(FETCH_CHAIN_ID_SERVICE)
    private readonly fetchChainIdService: IFetchChainIdService,
    @Inject(CREDENTIAL_CREATOR)
    private readonly credentialCreator: ICredentialCreator
  ) {
    this.domain = this.environmentGetter.getEnsDomain();
  }

  async verifyRecords(
    verifyRecordsRequest: VerifyRecordsRequest
  ): Promise<VerifyRecordsResponse[]> {
    const { ens, credentials, issuer, providerUrl } = verifyRecordsRequest;

    const validIssuer = issuer ? issuer : this.domain;

    const chainId = await this.fetchChainIdService.getChainId(providerUrl);

    if (chainId !== 1 && chainId !== 11155111) {
      throw ChainIdInvalidException.withId(chainId);
    }

    const subnameRecords =
      await this.subnameRecordsFetcher.fetchRecordsFromManySubnames(
        providerUrl,
        ens,
        chainId,
        [
          ...credentials,
          ...credentials.map((record) => `${record}_${validIssuer}`),
        ]
      );
    const responses: VerifyRecordsResponse[] = [];
    for (const subnameRecord of subnameRecords) {
      const verificationPromises = credentials.map((record) =>
        this._recordVerifier(
          record,
          subnameRecord,
          chainId,
          validIssuer,
          verifyRecordsRequest.matchStandard
        )
      );

      const results = await Promise.all(verificationPromises);

      const mergedRecords = results.reduce(
        (acc, curr) => ({
          ...acc,
          records: { ...acc.records, ...curr.records },
        }),
        { subname: subnameRecord.subname, records: {} }
      );

      responses.push(mergedRecords);
    }

    return responses;
  }

  private async _recordVerifier(
    record: string,
    subnameRecords: Subname,
    chainId: ChainId,
    issuer: string,
    matchStandard: boolean
  ): Promise<VerifyRecordsResponse> {
    // 1) check if record_issuer exists in subnameRecords, if not return false
    const foundRecordIssuer = subnameRecords.metadata.textRecords.find(
      (item) => item.key === `${record}_${issuer}`
    );
    let vc: VerifiableEthereumEip712Signature2021;
    if (!foundRecordIssuer) {
      return this.setRecordVerification(subnameRecords.subname, record, false);
    }
    // 2) parse the value of record_issuer
    try {
      vc = JSON.parse(
        foundRecordIssuer.value
      ) as VerifiableEthereumEip712Signature2021;
    } catch (error) {
      return this.setRecordVerification(subnameRecords.subname, record, false);
    }
    // 3) check the expirationDate, if expired return false
    const currentDate = new Date();
    const expirationDate = new Date(vc.expirationDate);
    if (expirationDate < currentDate) {
      return this.setRecordVerification(subnameRecords.subname, record, false);
    }

    // 4) check if it belongs to the subname, if not return false
    const didSubnameWithFragment =
      chainId == 1
        ? vc.credentialSubject.did.split(':')[2]
        : vc.credentialSubject.did.split(':')[3];
    const didSubname = didSubnameWithFragment.split('#')[0];

    if (didSubname !== subnameRecords.subname) {
      return this.setRecordVerification(subnameRecords.subname, record, false);
    }

    // 5) check the issuer did, if not return false
    const issuerDid = vc.issuer.id.split(':');

    let issuerChain = issuerDid[2];

    if (issuerChain !== 'sepolia') {
      issuerChain = 'mainnet';
    }
    const issuerNameFragment = chainId == 1 ? issuerDid[2] : issuerDid[3];

    const issuerName = issuerNameFragment.split('#')[0];

    if (issuerName !== issuer || this.chainIdMapping[issuerChain] !== chainId) {
      return this.setRecordVerification(subnameRecords.subname, record, false);
    }
    // 6) verify signature
    let veramoVerification: boolean;
    try {
      veramoVerification = await this.credentialCreator.verifyCredential(
        vc,
        chainId
      );
      if (!veramoVerification) {
        return this.setRecordVerification(
          subnameRecords.subname,
          record,
          false
        );
      }
    } catch (error) {
      return this.setRecordVerification(subnameRecords.subname, record, false);
    }

    // 7) check if it's on the correct chain, if not return false (for both the issuer did and credential subject did, and the chainId in the proof)
    const subjectDid = vc.credentialSubject.did.split(':');

    let subjectChain = subjectDid[2]; // Extract chain from DID
    if (subjectChain !== 'sepolia') {
      subjectChain = 'mainnet';
    }

    if (
      this.chainIdMapping[subjectChain] !== chainId ||
      Number(vc.proof.eip712.domain.chainId) !== chainId
    ) {
      return this.setRecordVerification(subnameRecords.subname, record, false);
    }

    const typedVc = vc as VerifiableEthereumEip712Signature2021;

    const type = typedVc.type[1];

    let handle = '';
    switch (type) {
      case 'VerifiableTwitterAccount':
        handle = (
          typedVc as VerifiableEthereumEip712Signature2021<TwitterCredential>
        ).credentialSubject.username;
        break;
      case 'VerifiableGithubAccount':
        handle = (
          typedVc as VerifiableEthereumEip712Signature2021<GithubCredential>
        ).credentialSubject.username;
        break;
      case 'VerifiableTelegramAccount':
        handle = (
          typedVc as VerifiableEthereumEip712Signature2021<TelegramCredential>
        ).credentialSubject.username;
        break;
      case 'VerifiableEmailAddress':
        handle = (
          typedVc as VerifiableEthereumEip712Signature2021<EmailCredential>
        ).credentialSubject.email;
        break;
      case 'VerifiableDiscordAccount':
        handle = (
          typedVc as VerifiableEthereumEip712Signature2021<DiscordCredential>
        ).credentialSubject.username;
        break;
      default:
        break;
    }

    // 8) check that the value of the username of the credentialSubject matches the value of the record inside the subnameRecords, if not return false
    if (matchStandard) {
      const foundRecord = subnameRecords.metadata.textRecords.find(
        (item) => item.key === record
      );

      if (!foundRecord) {
        return this.setRecordVerification(
          subnameRecords.subname,
          record,
          false
        );
      }

      if (handle !== foundRecord.value) {
        return this.setRecordVerification(
          subnameRecords.subname,
          record,
          false
        );
      }
    }

    return this.setRecordVerification(subnameRecords.subname, record, true);
  }

  private setRecordVerification(
    subname: string,
    record: string,
    value: boolean
  ) {
    return {
      subname,
      records: {
        [record]: value,
      },
    };
  }
}
