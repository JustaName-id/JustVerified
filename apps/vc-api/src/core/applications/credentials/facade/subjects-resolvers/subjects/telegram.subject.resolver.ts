import { AbstractSubjectResolver } from './abstract.subject.resolver';
import * as crypto from 'crypto';
import { TelegramCredential } from '../../../../../domain/credentials/telegram.credential';
import { TelegramCallback } from './callback/telegram.callback';
import { VerifiedEthereumEip712Signature2021 } from '../../../../../domain/entities/eip712';

export class TelegramSubjectResolver extends AbstractSubjectResolver<
  TelegramCallback,
  TelegramCredential
> {

  async callbackSuccessful(
    params: TelegramCallback, ens: string
  ): Promise<VerifiedEthereumEip712Signature2021> {
    const { hash, ...telegramData } = params;

    const dataCheckString = Object.keys(telegramData)
      .sort()
      .map((key) => `${key}=${telegramData[key]}`)
      .join('\n');

    const secretKey = crypto
      .createHash('sha256')
      .update(process.env.TELEGRAM_BOT_TOKEN!)
      .digest();

    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString);
    const calculatedHash = hmac.digest('hex');

    if (calculatedHash !== hash) {
      throw new Error('Invalid data: Authentication failed.');
    }

    const verifiedCredential = await this.generateCredentialSubject({
      username: telegramData.username,
    }, ens);

    return verifiedCredential;
  }

  getAuthUrl(): string {
    return `<html>
      <body>
        <script async src="https://telegram.org/js/telegram-widget.js?15"
                data-telegram-login="${this.environmentGetter.getTelegramBotUsername()}"
                data-size="large"
                data-auth-url="/auth/telegram/callback"
                data-request-access="write">
        </script>
      </body>
    </html>`;
  }

  getCallbackParameters(): string[] {
    return [];
  }

  getContext(): string[] {
    return [];
  }

  getCredentialName(): string {
    return 'telegram';
  }

  getType(): string[] {
    return ['VerifiableTelegramAccount'];
  }
}
