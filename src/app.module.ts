import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => config.typeorm,
    }),
  ],
})

export class AppModule {}
