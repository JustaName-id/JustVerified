export const CRYPTO_SERVICE = 'CRYPTO_SERVICE'

export interface ICryptoService {
  encrypt(data: string): string;
  decrypt(data: string): string;
  generateCodeVerifier(): string;
  generateCodeChallenge(verifier: string): string;
  createTelegramHash(data: string): string;
  createHash(data: string): Buffer;
  timingSafeEqual(firstHash: Buffer, secondHash: Buffer): boolean;
  generateOtp(email: string): string;
}
