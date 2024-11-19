export class VerifyRecordsResponse {
  subname: string;
  records: {
    [key: string]: boolean;
  }
}
