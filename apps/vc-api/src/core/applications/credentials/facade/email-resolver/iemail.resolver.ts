import {AbstractResolver} from "../abstract.resolver";
import {EmailCallback} from "./email.callback";
import {EmailCredential} from "../../../../domain/credentials/email.credential";
import {EmailOtpGenerateRequest} from "./requests/email.otp.generate.request";
import {EmailOtpGenerateResponse} from "./responses/email.otp.generate.response";

export const EMAIL_RESOLVER = 'EMAIL_RESOLVER'

export interface  IEmailResolver extends AbstractResolver<EmailCallback, EmailCredential>{
  generateEmailOtp(emailOtpGenerateRequest: EmailOtpGenerateRequest): Promise<EmailOtpGenerateResponse>
  resendOtp(state: string): Promise<void>
  clearState(state: string): void
}
