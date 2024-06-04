import { MessageDto } from '@app/modules/message/dto/message.dto';
import { MessageEntity } from '@app/modules/message/message.entity';
import { MessageRepository } from '@app/modules/message/message.repository';
import { IReadMessage } from '@app/modules/message/types';
import { UserService } from '@app/modules/user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Between } from 'typeorm';
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

  async findAllByConversationId(conversationId: number, limit: number = 20): Promise<MessageDto[]> {
    const messages = await this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    if (!messages.length) {
      return [];
    }
    return Promise.all(messages.map(async item => await this.getMessagesWithUserNames(item)));
  }

  async getUnreadMessages(userId: number): Promise<MessageDto[]> {
    const messages = await this.messageRepository.find({
      where: { recieverId: userId, isReaded: false },
      order: { createdAt: 'DESC' },
    });

    if (!messages.length) {
      return [];
    }
    return Promise.all(messages.map(async item => await this.getMessagesWithUserNames(item)));
  }

  async findLastMessage(userId: number): Promise<MessageDto | undefined> {
    const messages = await this.messageRepository.find({
      where: [{ recieverId: userId }, { senderId: userId }],
      order: { createdAt: 'DESC' },
      take: 1,
    });

    if (!messages.length) return;
    return this.getMessagesWithUserNames(messages[0]);
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

  async readMessage(params: IReadMessage): Promise<void> {
    const { id, senderId, conversationId } = params;
    await this.getByIdOrFail(id);
    const conversationMessages = await this.findAllByConversationId(conversationId);
    const isLastReadedId = conversationMessages.filter(item => item.isReaded).map(item => item.id);
    const lastReadedId = isLastReadedId.length
      ? Math.max(...isLastReadedId)
      : conversationMessages[conversationMessages.length - 1].id;

    let messages = await this.messageRepository.find({
      where: { conversationId, senderId, id: Between(lastReadedId, id) },
    });
    messages.forEach(message => {
      message.isReaded = true;
    });

    await this.messageRepository.save(messages);
  }

  async getByIdOrFail(id: number): Promise<MessageEntity> {
    const conversation = await this.messageRepository.findOne({
      where: { id },
    });

    if (!conversation) {
      throw new NotFoundException('Message not found');
    }

    return conversation;
  }
}
