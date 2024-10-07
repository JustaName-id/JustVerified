import { BaseExceptionFilter } from '@nestjs/core';
import { BaseFilterResponse } from '../baseFilter.response';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { OTPException } from '../../../core/domain/exceptions/OTP.exception';

@Catch(OTPException)
export class OTPExceptionFilter extends BaseExceptionFilter {
  catch(exception: OTPException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.BAD_REQUEST;

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
