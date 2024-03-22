import { MessageDto } from '@app/modules/message/dto/message.dto';
import { MessageEntity } from '@app/modules/message/message.entity';
import { MessageRepository } from '@app/modules/message/message.repository';
import { UserService } from '@app/modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create.message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userService: UserService
  ) {}

  private connectedClients: Map<number, string> = new Map();

  connectClients(userId: number, socketId: string): Map<number, string> {
    this.connectedClients.set(userId, socketId);
    return this.connectedClients;
  }

  getRoomClients(recieverId: number, senderId: number): string[] {
    const socketIds: string[] = [];
    for (const [userId, socketId] of this.connectedClients) {
      if (userId === recieverId || userId === senderId) {
        socketIds.push(socketId);
      }
    }
    return socketIds;
  }

  async create(params: CreateMessageDto): Promise<MessageDto> {
    const entity = this.messageRepository.create(params);
    const message = await this.messageRepository.save(entity);
    return this.getMessagesWithUserNames(message);
  }

  async findAllByConversationId(conversationId: number): Promise<MessageDto[]> {
    const messages = await this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'DESC' },
    });
    return Promise.all(messages.map(async item => await this.getMessagesWithUserNames(item)));
  }

  async getMessagesWithUserNames(message: MessageEntity): Promise<MessageDto> {
    const sender = await this.userService.getByIdOrFail(message.senderId);
    const receiver = await this.userService.getByIdOrFail(message.recieverId);
    return {
      ...message,
      senderName: sender?.name || '',
      recieverName: receiver?.name || '',
    };
  }
}
