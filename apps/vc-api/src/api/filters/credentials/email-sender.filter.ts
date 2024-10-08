import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { EmailSenderException } from '../../../core/domain/exceptions/EmailSender.exception';

@Catch(EmailSenderException)
export class EmailSenderExceptionFilter extends BaseExceptionFilter {
  catch(exception: EmailSenderException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(httpStatus).json({
      message: exception.message,
    });
  }
}
