export interface Text {
  key: string;
  value: string;
}
export interface Coin {
  id: number;
  name: string;
  value: string;
}
export interface ContentHash {
  protocolType: string;
  decoded: string;
}

export class GetRecordsResponse {
  resolverAddress: string;
  texts: Text[];
  coins: Coin[];
  contentHash: ContentHash | null;
  isJAN: boolean;
}
