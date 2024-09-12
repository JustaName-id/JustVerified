import { TextRecord } from './textRecord';
import { Address } from './address';

export class Metadata {
  contentHash: string;
  addresses: Address[];
  textRecords: TextRecord[];
}
