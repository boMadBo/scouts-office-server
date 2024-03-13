import { AppModule } from '@app/app.module';
import { config } from '@app/config';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector, { strategy: 'excludeAll' }));
  app.useStaticAssets('src/uploads', { prefix: '/api/uploads' });

  await app.listen(config.api.port);
}
bootstrap();
