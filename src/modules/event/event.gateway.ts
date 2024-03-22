import { config } from '@app/config';
import { CreateMessageDto } from '@app/modules/message/dto/create.message.dto';
import { MessageService } from '@app/modules/message/message.service';
import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  port: config.api.port,
})
export class EventGateway implements OnModuleInit {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly messageService: MessageService) {}

  onModuleInit() {
    this.server.on('connection', socket => {});
  }

  @SubscribeMessage('subscribeToConversation')
  async subscribeToConversation(@MessageBody() data: { userId: number }, @ConnectedSocket() socket: Socket) {
    const connectedClients = this.messageService.connectClients(data.userId, socket.id);
    socket.emit('subscribtions', connectedClients);
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(@MessageBody() body: CreateMessageDto): Promise<void> {
    const { recieverId, senderId } = body;
    const newMessage = await this.messageService.create(body);
    const roomClients = this.messageService.getRoomClients(recieverId, senderId);
    this.server.to(roomClients).emit('onMessage', newMessage);
  }

  @SubscribeMessage('findAllMessages')
  async getAllMessags(
    @MessageBody() body: { conversationId: number },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    const messages = await this.messageService.findAllByConversationId(body.conversationId);
    socket.emit('allMessages', messages);
  }
}
