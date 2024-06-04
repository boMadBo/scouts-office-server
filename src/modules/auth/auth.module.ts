import { config } from '@app/config';
import { AuthController } from '@app/modules/auth/auth.controller';
import { AuthService } from '@app/modules/auth/auth.service';
import { OutwardModule } from '@app/modules/outward/outward.module';
import { UserModule } from '@app/modules/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
    }),
    UserModule,
    OutwardModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}