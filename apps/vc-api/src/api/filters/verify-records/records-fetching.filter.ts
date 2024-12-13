import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { RecordsFetchingException } from '../../../core/domain/exceptions/RecordsFetching.exception';

@Catch(RecordsFetchingException)
export class RecordsFetchingExceptionFilter extends BaseExceptionFilter {
  catch(exception: RecordsFetchingException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.BAD_REQUEST;

    response.status(httpStatus).json({
      message: exception.message,
    });
  }
}
