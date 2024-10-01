import { Inject, Injectable } from '@nestjs/common';
import { ICryptoService } from '../../core/applications/crypto/icrypto.service';
import * as crypto from 'crypto';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../core/applications/environment/ienvironment.getter';

@Injectable()
export class CryptoService implements ICryptoService {

  private readonly algorithm = 'aes-256-cbc';
  private readonly key : Buffer

  constructor(
    @Inject(ENVIRONMENT_GETTER)
    private readonly environmentGetter: IEnvironmentGetter
  ) {
    this.key= crypto.scryptSync(
      this.environmentGetter.getEncryptKey(),
      this.environmentGetter.getEncryptSalt(),
      32
    );
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(text: string): string {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  generateCodeChallenge(codeVerifier: string): string {
    return crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  }

  createTelegramHash(data: string): string {
    const secretKey = crypto
      .createHash('sha256')
      .update(this.environmentGetter.getTelegramBotToken())
      .digest();

    const hmac = crypto.createHmac('sha256', secretKey).update(data);
    const calculatedHash = hmac.digest('hex');

    return calculatedHash;
  }

  createHash(data: string): Buffer {
    return crypto.createHash('sha256').update(data).digest();
  }

  timingSafeEqual(firstHash: Buffer, secondHash: Buffer): boolean {
    return crypto.timingSafeEqual(firstHash, secondHash)
  }

  generateOtp(email: string): string {

    const salt = crypto.randomBytes(16).toString('hex');

    const timestamp = Date.now().toString();

    const hmac = crypto.createHmac('sha256',
        this.environmentGetter.getEncryptKey()
      );
    hmac.update(email + salt + timestamp);

    const hash = hmac.digest('hex');

    const otpNumeric = parseInt(hash.substring(0, 16), 16);
    const otp = (otpNumeric % 1000000).toString().padStart(8, '0');

    return otp
  }
}
