import { ConversationEntity } from '@app/modules/conversation/conversation.entity';
import { ConversationRepository } from '@app/modules/conversation/conversation.repository';
import { CreateConversationDto } from '@app/modules/conversation/dto/create.conversation.dto';
import { IConversationWithNames } from '@app/modules/conversation/types';
import { UserService } from '@app/modules/user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService
  ) {}

  @Transactional()
  async create({ participantId }: CreateConversationDto, userId: number): Promise<IConversationWithNames> {
    const conversation = await this.conversationRepository.getByParticipantId(participantId);

    if (conversation) {
      return conversation;
    }

    const entity = this.conversationRepository.create({
      participantsIds: [participantId, userId],
    });

    const result = await this.conversationRepository.save(entity);
    return this.getByIdWithUserName(result.id, userId);
  }

  async list(userId: number): Promise<IConversationWithNames[]> {
    const conversations = await this.conversationRepository.getAllByParticipantId(userId);
    if (!conversations) {
      throw new NotFoundException('Conversations not found');
    }

    const result = await Promise.all(conversations.map(item => this.getByIdWithUserName(item.id, userId)));
    return result;
  }

  async getByIdWithUserName(id: number, userId: number): Promise<IConversationWithNames> {
    const conversation = await this.getByIdOrFail(id);
    const users = await this.userService.getByIds(conversation.participantsIds);

    const user = {
      id: userId,
      name: users.find(item => item.id === userId)?.name,
    };

    const interlocutor = {
      id: users.find(item => item.id !== userId)?.id,
      name: users.find(item => item.id !== userId)?.name,
    };

    return {
      ...conversation,
      user,
      interlocutor,
    };
  }

  async getByIdOrFail(id: number): Promise<ConversationEntity> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async update(id: number, userId: number): Promise<IConversationWithNames> {
    let conversation = await this.getByIdOrFail(id);
    conversation = this.conversationRepository.merge(conversation, { updatedAt: new Date() });
    await conversation.save();

    return this.getByIdWithUserName(conversation.id, userId);
  }
}
