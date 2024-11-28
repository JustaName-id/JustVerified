import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Web3ProviderException } from '../../../core/domain/exceptions/Web3Provider.exception';

@Catch(Web3ProviderException)
export class Web3ProviderExceptionFilter extends BaseExceptionFilter {
  catch(exception: Web3ProviderException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.BAD_REQUEST;

    response.status(httpStatus).json({
      message: exception.message,
    });
  }
}