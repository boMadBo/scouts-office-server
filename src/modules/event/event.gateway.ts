import { config } from '@app/config';
import { CreateMessageDto } from '@app/modules/message/dto/create.message.dto';
import { MessageService } from '@app/modules/message/message.service';
import { IReadMessage } from '@app/modules/message/types';
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
    this.server.on('connection', () => {});
  }

  @SubscribeMessage('subscribeToConversation')
  async subscribeToConversation(@MessageBody() data: { userId: number }, @ConnectedSocket() socket: Socket) {
    this.messageService.connectClients(data.userId, socket.id);
    socket.emit('subscribtions', () => {});
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(@MessageBody() body: CreateMessageDto, @ConnectedSocket() socket: Socket): Promise<void> {
    const { recieverId, senderId } = body;
    const newMessage = await this.messageService.create(body);
    const roomClients = this.messageService.getRoomClients(recieverId, senderId);

    const unreadMessages = await this.messageService.getUnreadMessages(body.senderId);
    socket.emit('unreadMessages', unreadMessages);
    const messages = await this.messageService.findAllByConversationId(body.conversationId);
    socket.emit('conversationMessages', messages);
    const message = await this.messageService.findLastMessage(body.recieverId);
    socket.emit('lastMessage', message);
    this.server.to(roomClients).emit('onMessage', newMessage);
  }

  @SubscribeMessage('findConversationMessages')
  async getConversationMessages(
    @MessageBody() body: { conversationId: number; limit: number },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    const { conversationId, limit } = body;
    const messages = await this.messageService.findAllByConversationId(conversationId, limit);
    socket.emit('conversationMessages', messages);
  }

  @SubscribeMessage('findUnreadMessages')
  async getUnreadMessages(@MessageBody() body: { userId: number }, @ConnectedSocket() socket: Socket): Promise<void> {
    const messages = await this.messageService.getUnreadMessages(body.userId);
    socket.emit('unreadMessages', messages);
  }

  @SubscribeMessage('findLastMessage')
  async findLastMessage(@MessageBody() body: { userId: number }, @ConnectedSocket() socket: Socket): Promise<void> {
    const message = await this.messageService.findLastMessage(body.userId);
    socket.emit('lastMessage', message);
  }

  @SubscribeMessage('updateMessage')
  async readMessage(@MessageBody() body: IReadMessage, @ConnectedSocket() socket: Socket): Promise<void> {
    await this.messageService.readMessage(body);

    const unreadMessages = await this.messageService.getUnreadMessages(body.userId);
    socket.emit('unreadMessages', unreadMessages);
    const messages = await this.messageService.findAllByConversationId(body.conversationId);
    socket.emit('conversationMessages', messages);
    socket.emit('readMessage', () => {});
  }
}
