import { AppModule } from '@app/app.module';
import { config } from '@app/config';
import { setupSwagger } from '@app/swagger';
import { BadRequestException, ClassSerializerInterceptor, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  setupSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(errors);
      },
      whitelist: true,
      transform: true,
      transformOptions: {
        exposeUnsetFields: true,
      },
      validationError: {
        target: false,
      },
    })
  );

  app.enableCors();
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useStaticAssets('src/uploads', { prefix: '/api/uploads' });

  await app.listen(config.api.port);
}
bootstrap();
