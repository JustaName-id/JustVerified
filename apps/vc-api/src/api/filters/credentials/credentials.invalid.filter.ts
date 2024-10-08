import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { CredentialsInvalidException } from '../../../core/domain/exceptions/CredentialsInvalid.exception';

@Catch(CredentialsInvalidException)
export class CredentialsInvalidExceptionFilter extends BaseExceptionFilter {
  catch(exception: CredentialsInvalidException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.BAD_REQUEST;

    response.status(httpStatus).json({
      message: exception.message,
    });
  }
}
