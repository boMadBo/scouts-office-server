import { MessageRepository } from '@app/modules/message/message.repository';
import { UserModule } from '@app/modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageRepository]), UserModule],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
