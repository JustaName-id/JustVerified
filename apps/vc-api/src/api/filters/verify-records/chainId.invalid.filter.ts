import { BaseExceptionFilter } from '@nestjs/core';
import { BaseFilterResponse } from '../baseFilter.response';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { ChainIdInvalidException } from '../../../core/domain/exceptions/ChainIdInvalid.exception';

@Catch(ChainIdInvalidException)
export class ChainIdInvalidExceptionFilter extends BaseExceptionFilter {
  catch(exception: ChainIdInvalidException, host: ArgumentsHost) {
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
