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
    const allMessages = await this.messageService.findAllByUserId(body.recieverId);
    socket.emit('allMessages', allMessages);
    this.server.to(roomClients).emit('onMessage', newMessage);
  }

  @SubscribeMessage('findAllMessages')
  async getAllMessages(@MessageBody() body: { userId: number }, @ConnectedSocket() socket: Socket): Promise<void> {
    const messages = await this.messageService.findAllByUserId(body.userId);
    socket.emit('allMessages', messages);
  }

  @SubscribeMessage('updateMessage')
  async readMessage(@MessageBody() body: IReadMessage, @ConnectedSocket() socket: Socket): Promise<void> {
    await this.messageService.readMessage(body);
    const allMessages = await this.messageService.findAllByUserId(body.userId);
    socket.emit('allMessages', allMessages);
    socket.emit('readMessage', () => {});
  }
}
