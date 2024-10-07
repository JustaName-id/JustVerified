import { BaseExceptionFilter } from '@nestjs/core';
import { BaseFilterResponse } from '../baseFilter.response';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { AuthenticationException } from '../../../core/domain/exceptions/Authentication.exception';

@Catch(AuthenticationException)
export class AuthenticationExceptionFilter extends BaseExceptionFilter {
  catch(exception: AuthenticationException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.UNAUTHORIZED;

    const result: BaseFilterResponse = {
      statusCode: httpStatus,
      result: {
        data: null,
        error: exception.message,
      },
    };

    response.status(httpStatus).json(result);
  }
}
