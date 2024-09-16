/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import {
  HttpException,
  Logger,
  ValidationPipe,
  ValidationError,
  VersioningType,
} from '@nestjs/common';
import { VCManagementModule } from './vc-management.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    VCManagementModule,
    {
      bufferLogs: true,
      rawBody: true,
    }
  );

  app.enableCors({
    origin: true,
    credentials: true,
  })


  const globalPrefix = 'verifications';

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

  const version = '1';

  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: version,
    })
    .setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3009;
  await app.listen(port);

  if (process.env.NODE_ENV === 'development') {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}/v${version}`
    );
  }
}

bootstrap();
