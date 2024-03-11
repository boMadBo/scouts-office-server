import { config } from '@app/config';
import { AuthModule } from '@app/modules/auth/auth.module';
import { UserModule } from '@app/modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => config.typeorm,
    }),
  ],
})

export class AppModule {}
