import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { AuthenticationException } from '../../../core/domain/exceptions/Authentication.exception';

@Catch(AuthenticationException)
export class AuthenticationExceptionFilter extends BaseExceptionFilter {
  catch(exception: AuthenticationException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.UNAUTHORIZED;

    response.status(httpStatus).json({
      message: exception.message,
    });
  }
}
