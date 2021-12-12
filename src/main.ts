import { BadRequestException, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      validationError: { target: true, value: true },
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        let errorObj = {};
        errors.forEach((val) => {
          errorObj[val.property] = Object.values(val.constraints)[0];
        });
        return new BadRequestException({
          statusCode: 400,
          message: 'Bad Request',
          error: errorObj,
        });
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
