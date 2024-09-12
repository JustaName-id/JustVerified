/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { HttpException, Logger, ValidationPipe, ValidationError, VersioningType } from '@nestjs/common';
import { VCManagementModule } from './vc-management.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    VCManagementModule,
      {
        bufferLogs: true,
        rawBody: true,
      }
  );
  const globalPrefix = '';

  app.useBodyParser('json');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new HttpException(
          {
            statusCode: 400,
            result: {
              data: null,
              error: validationErrors.reduce<string[]>(
                (validationError, error) => {
                  return validationError.concat(
                    Object.values(error.constraints)
                  );
                },
                []
              ),
            },
          },
          400
        );
      },
    })
  );
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
