import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { VerificationFailedException } from '../../../core/domain/exceptions/VerificationFailed.exception';

@Catch(VerificationFailedException)
export class VerificationFailedExceptionFilter extends BaseExceptionFilter {
  catch(exception: VerificationFailedException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.BAD_REQUEST;

    response.status(httpStatus).json({
      message: exception.message,
    });
  }
}
