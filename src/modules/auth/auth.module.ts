import { config } from '@app/config';
import { UserModule } from '@app/modules/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {
}