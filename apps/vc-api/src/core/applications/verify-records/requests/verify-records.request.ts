export class VerifyRecordsRequest {
  ens: string;
  credentials: string[];
  chainId: number;
  matchStandard?: boolean;
  issuer: string;
}
