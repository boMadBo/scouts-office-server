import { AuthMiddleware } from '@app/common/middlewares/auth.middleware';
import { config } from '@app/config';
import { AuthModule } from '@app/modules/auth/auth.module';
import { ConversationModule } from '@app/modules/conversation/conversation.module';
import { EventModule } from '@app/modules/event/event.module';
import { TaskModule } from '@app/modules/task/task.module';
import { UserModule } from '@app/modules/user/user.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TaskModule,
    ConversationModule,
    MessageModule,
    EventModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => config.typeorm,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
