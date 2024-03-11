import { AppModule } from '@app/app.module';
import { config } from '@app/config';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  // patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(config.api.port);
}
bootstrap();
