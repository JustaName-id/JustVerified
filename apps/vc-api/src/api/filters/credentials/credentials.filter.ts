import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { CredentialsException } from '../../../core/domain/exceptions/Credentials.exception';

@Catch(CredentialsException)
export class CredentialsExceptionFilter extends BaseExceptionFilter {
  catch(exception: CredentialsException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.BAD_REQUEST;

    response.status(httpStatus).json({
      message: exception.message,
    });
  }
}
