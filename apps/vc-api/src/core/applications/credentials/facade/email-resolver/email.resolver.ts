import {AbstractResolver} from "../abstract.resolver";
import {Inject, Injectable} from "@nestjs/common";
import {EmailCallback} from "./email.callback";
import {EmailCredential} from "../../../../domain/credentials/email.credential";
import {EMAIL_SENDER, IEmailSender} from "../../../email-sender/iemail-sender.service";
import {EmailOtpGenerateRequest} from "./requests/email.otp.generate.request";
import {IEmailResolver} from "./iemail.resolver";
import {EmailOtpGenerateResponse} from "./responses/email.otp.generate.response";
import { OTPException } from "../../../../domain/exceptions/OTP.exception";


@Injectable()
export class EmailResolver extends AbstractResolver<
EmailCallback,
EmailCredential
> implements IEmailResolver  {
  @Inject(EMAIL_SENDER)
  readonly emailSender: IEmailSender

  otpStore = new Map<string, { email: string, otpHash: Buffer, expiresAt: number }>();

  getKey(): string {
    return 'email';
  }

  getType(): string[] {
    return ['VerifiableEmailAddress'];
  }

  generateOtp(email: string): { otp: string; expiresAt: number } {
    const otp = this.cryptoEncryption.generateOtp(email)
    const expiresAt = Date.now() + 3 * 60 * 1000;
    return { otp, expiresAt };
  }

  async extractCredentialSubject(
    params: EmailCallback,
  ): Promise<EmailCredential> {
    const { authId } = this.decryptState(params.state)
    const otpData = this.otpStore.get(authId);
    if (!otpData) {
      throw OTPException.notFound();
    }

    const currentTime = Date.now();
    if (otpData.expiresAt < currentTime) {
      this.otpStore.delete(authId);
      throw OTPException.expired();
    }

    const hashedOtp = this.cryptoEncryption.createHash(params.otp);

    if (!this.cryptoEncryption.timingSafeEqual(hashedOtp, otpData.otpHash)) {
      throw OTPException.invalid();
    }

    const email = this.otpStore.get(authId).email
    this.otpStore.delete(authId);

    return {
      email,
    };
  }

  clearState(state: string) {
    const { authId} = this.decryptState(state);
    this.otpStore.delete(authId);
    return authId;
  }

  async generateEmailOtp(emailOtpGenerateRequest: EmailOtpGenerateRequest): Promise<EmailOtpGenerateResponse> {

    const { email, ens, chainId, authId } = emailOtpGenerateRequest;
    const { otp, expiresAt } = this.generateOtp(email);

    if (this.otpStore.has(authId)) {
      this.otpStore.delete(authId);
    }

    this.otpStore.set(authId, {
      email,
      otpHash: this.cryptoEncryption.createHash(otp),
      expiresAt
    });

    const encryptedState = this.encryptState({
      ens,
      chainId,
      authId,
    });

    const emailNotification = {
      to: email,
      subject: 'Email Verification',
      content: {
        otp,
      },
    };

    await this.emailSender.sendEmail(emailNotification);

    return {
      state: encryptedState
    };

  }

  async resendOtp(state: string): Promise<void> {
    const { authId } = this.decryptState(state);
    const otpData = this.otpStore.get(authId);
    if (!otpData) {
      throw OTPException.notFound();
    }

    const { email } = otpData;

    const newOtpData = this.generateOtp(email);

    this.otpStore.set(authId, {
      email,
      otpHash: this.cryptoEncryption.createHash(newOtpData.otp),
      expiresAt: newOtpData.expiresAt
    });

    const emailNotification = {
      to: email,
      subject: 'Email Verification',
      content: {
        otp: newOtpData.otp,
      },
    };

    await this.emailSender.sendEmail(emailNotification);
  }
}
