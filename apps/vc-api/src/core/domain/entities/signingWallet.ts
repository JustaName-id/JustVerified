export class SigningWallet {
  public publicKey: string;
  public privateKey: string;

  constructor(address: string, privateKey: string) {
    this.publicKey = address;
    this.privateKey = privateKey;
  }
}
