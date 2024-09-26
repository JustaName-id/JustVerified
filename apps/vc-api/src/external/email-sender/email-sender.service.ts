import * as React from 'react';

import { Resend } from 'resend';
import { Inject, Injectable } from '@nestjs/common';
import { IEmailSender } from '../../core/applications/email-sender/iemail-sender.service';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../core/applications/environment/ienvironment.getter';
import { EmailNotification } from '../../core/domain/entities/emailNotification';

@Injectable()
export class EmailSender implements IEmailSender {
  resend: Resend;

  constructor( @Inject(ENVIRONMENT_GETTER) private readonly environmentGetter: IEnvironmentGetter,) {
    const apiKey = this.environmentGetter.getResendApiKey();
    this.resend = new Resend(apiKey);
  }

  async sendEmail(
    emailNotification: EmailNotification
  ): Promise<void> {

    const { error } = await this.resend.emails.send({
      from: 'JustaName <noreply@justaname.id>',
      to: emailNotification.to,
      subject: emailNotification.subject,
      react: React.createElement(emailNotification.content.otp),
    });

    if (error) {
      throw new Error(
        `Error while sending email for Email Verification: ${error.message}`
      );
    }
  }
}