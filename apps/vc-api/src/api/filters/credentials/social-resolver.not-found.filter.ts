import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { SocialResolverNotFoundException } from '../../../core/domain/exceptions/SocialResolverNotFound.exception';

@Catch(SocialResolverNotFoundException)
export class SocialResolverNotFoundExceptionFilter extends BaseExceptionFilter {
  catch(exception: SocialResolverNotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const httpStatus = HttpStatus.NOT_FOUND;

    response.status(httpStatus).json({
        message: exception.message,
    });
  }
}
