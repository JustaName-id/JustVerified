import { AbstractSocialResolver } from './abstract.social.resolver';
import { TelegramCredential } from '../../../../../domain/credentials/telegram.credential';
import { TelegramCallback } from './callback/telegram.callback';
import {GetAuthUrlRequest} from "./requests/get-auth-url.request";
import { CredentialsInvalidException } from '../../../../../domain/exceptions/CredentialsInvalid.exception';

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
  getAuthUrl(authUrlRequest:GetAuthUrlRequest): string {
    const state = this.encryptState(authUrlRequest);
    return (
      `<html>
        <body>
          <script async src="https://telegram.org/js/telegram-widget.js?15"
                  data-telegram-login="${this.environmentGetter.getTelegramBotUsername()}"
                  data-size="large"
                  data-auth-url="/auth/telegram/callback?state=${state}"
                  data-request-access="write">
          </script>
        </body>
      </html>`
    );
  }

  async extractCredentialSubject(
    params: TelegramCallback
  ): Promise<TelegramCredential> {
    const { hash, ...telegramData } = params;

    const dataCheckString = Object.keys(telegramData)
      .sort()
      .map((key) => `${key}=${telegramData[key]}`)
      .join('\n');

    const calculatedHash = this.cryptoEncryption.createTelegramHash(dataCheckString);

    if (calculatedHash !== hash) {
      throw CredentialsInvalidException.withMessage('Invalid data: Authentication failed.');
    }

    return {
      username: telegramData.username,
    }
  }
}
