export class VerifyRecordsRequest {
  providerUrl: string;
  ens: string[];
  issuer: string;
  credentials: string[];
  matchStandard?: boolean;
}
