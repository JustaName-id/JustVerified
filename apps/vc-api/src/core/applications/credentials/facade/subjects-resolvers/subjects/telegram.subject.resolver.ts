import { AbstractSubjectResolver } from './abstract.subject.resolver';
import { Inject } from '@nestjs/common';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../../../environment/ienvironment.getter';
import { CREDENTIAL_CREATOR, ICredentialCreator } from '../../../creator/icredential.creator';
import { TIME_GENERATOR, TimeGenerator } from '../../../../time.generator';
import { HttpService } from '@nestjs/axios';

export class TelegramSubjectResolver extends AbstractSubjectResolver {
  constructor(
    @Inject(ENVIRONMENT_GETTER)
    readonly environmentGetter: IEnvironmentGetter,
    @Inject(CREDENTIAL_CREATOR)
    readonly credentialCreator: ICredentialCreator,
    @Inject(TIME_GENERATOR)
    private readonly timeGenerator: TimeGenerator,

    private readonly httpService: HttpService
  ) {
    super(
      credentialCreator,
      timeGenerator,
      environmentGetter
    );
  }

  callbackSuccessful(data: {}): Promise<void> {
    return Promise.resolve(undefined);
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
    return ['VerifiableTelegramAccount']
  }

}
