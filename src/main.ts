import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

// eslint-disable-next-line @typescript-eslint/no-var-requires

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
