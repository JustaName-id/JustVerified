import { AbstractSubjectResolver } from './abstract.subject.resolver';
import { VerifiableEthereumEip712Signature2021 } from '../../../../../domain/entities/eip712';
import { EmailCallback } from './callback/email.callback';
import { EmailCredential } from '../../../../../domain/credentials/email.credential';
import { Inject, Injectable } from '@nestjs/common';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../../../environment/ienvironment.getter';
import { EMAIL_SENDER, IEmailSender } from '../../../../email-sender/iemail-sender.service';

const otpStore = new Map<string, { otp: string, expiresAt: number }>();

@Injectable()
export class EmailSubjectResolver extends AbstractSubjectResolver<
  EmailCallback,
  EmailCredential
> {
  constructor(
    @Inject(ENVIRONMENT_GETTER)
    readonly environmentGetter: IEnvironmentGetter,

    @Inject(EMAIL_SENDER)
    readonly emailSender: IEmailSender
  ) {
    super();
  }

  async callbackSuccessful(
    params: EmailCallback,
    ens: string
  ): Promise<VerifiableEthereumEip712Signature2021> {
    const { email, otp } = params;

    const stateObject = JSON.parse(this.cryptoEncryption.decrypt(params.state));
    const { ens: storedEns } = stateObject;

    if (ens !== storedEns) {
      throw new Error('ENS mismatch.');
    }

    const otpData = otpStore.get(email);
    if (!otpData) {
      throw new Error('OTP not found or expired.');
    }

    const currentTime = Date.now();
    if (otpData.expiresAt < currentTime) {
      otpStore.delete(email);
      throw new Error('OTP has expired.');
    }

    if (otp !== otpData.otp) {
      throw new Error('Invalid OTP.');
    }

    const verifiedCredential = await this.generateCredentialSubject(
      { email },
      ens
    );

    otpStore.delete(email);

    return verifiedCredential;
  }

   getAuthUrl({ ens, authId }): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = Date.now() + 3 * 60 * 1000;

    const email = 'ghadi@justalab.co';
    otpStore.set(email, { otp, expiresAt });

    // const stateObject = { ens, authId };
    // const encryptedState = this.cryptoEncryption.encrypt(
    //   JSON.stringify(stateObject)
    // );

    const emailNotification = {
      to: email,
      subject: 'Email Verification',
      content: {
        otp,
      },
    };

     this.emailSender.sendEmail(emailNotification);

    return this.getCallbackUrl();
  }

  getCallbackParameters(): string[] {
    return ['email', 'otp'];
  }

  getContext(): string[] {
    return [];
  }

  getCredentialName(): string {
    return 'email';
  }

  getType(): string[] {
    return ['VerifiableEmailAddress'];
  }
}
