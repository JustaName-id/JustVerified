export class VerifyRecordsRequest {
  ens: string[];
  issuer: string;
  chainId: number;
  credentials: string[];
  matchStandard?: boolean;
}
