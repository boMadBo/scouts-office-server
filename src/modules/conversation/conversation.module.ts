import { ConversationController } from '@app/modules/conversation/conversation.controller';
import { ConversationRepository } from '@app/modules/conversation/conversation.repository';
import { ConversationService } from '@app/modules/conversation/conversation.service';
import { UserModule } from '@app/modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationRepository]), UserModule],
  controllers: [ConversationController],
  exports: [ConversationService],
  providers: [ConversationService],
})
export class ConversationModule {}
