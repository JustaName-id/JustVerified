import { AbstractSocialResolver } from './abstract.social.resolver';
import { TelegramCredential } from '../../../../../domain/credentials/telegram.credential';
import { TelegramCallback } from './callback/telegram.callback';
import { GetAuthUrlRequest } from './requests/get-auth-url.request';
import { CredentialsException } from '../../../../../domain/exceptions/Credentials.exception';

export class TelegramSocialResolver extends AbstractSocialResolver<
  TelegramCallback,
  TelegramCredential
> {
  getCredentialName(): string {
    return 'telegram';
  }

  getKey(): string {
    return 'org.telegram';
  }

  getType(): string[] {
    return ['VerifiableTelegramAccount'];
  }
  getAuthUrl(authUrlRequest: GetAuthUrlRequest): string {
    const state = this.encryptState(authUrlRequest);

    const telegramStaticPageUrl = this.environmentGetter.getTelegramStaticPageUrl();

    return `${telegramStaticPageUrl}?state=${state}`;
  }

  async extractCredentialSubject(
    params: TelegramCallback
  ): Promise<TelegramCredential> {
    const { hash, state, ...telegramData } = params;

    const dataCheckString = Object.keys(telegramData)
      .sort()
      .map((key) => `${key}=${telegramData[key]}`)
      .join('\n');

    const calculatedHash =
      this.cryptoEncryption.createTelegramHash(dataCheckString);

    if (calculatedHash !== hash) {
      throw CredentialsException.invalid();
    }

    return {
      username: telegramData.username,
    };
  }
}
