import { OutwardModule } from '@app/modules/outward/outward.module';
import { UserController } from '@app/modules/user/user.controller';
import { UserRepository } from '@app/modules/user/user.repository';
import { UserService } from '@app/modules/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), OutwardModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
