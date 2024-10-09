import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { JustaNameInitializerException } from '../../../core/domain/exceptions/JustaNameInitializer.exception';

@Catch(JustaNameInitializerException)
export class JustaNameInitializerExceptionFilter extends BaseExceptionFilter {
  catch(exception: JustaNameInitializerException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.BAD_GATEWAY;

    response.status(httpStatus).json({
      message: exception.message,
    });
  }
}
