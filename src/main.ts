import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { appSetup } from './setup/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSetup(app)
  app.enableCors();
  await app.listen(process.env.PORT ?? 1387);
}
bootstrap();
