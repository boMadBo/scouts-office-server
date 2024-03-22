import { EventGateway } from '@app/modules/event/event.gateway';
import { MessageModule } from '@app/modules/message/message.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [MessageModule],
  providers: [EventGateway],
  exports: [EventGateway],
})
export class EventModule {}
