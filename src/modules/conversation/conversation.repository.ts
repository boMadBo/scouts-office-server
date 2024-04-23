import { BaseRepository } from '@app/common/base.repository';
import { ConversationEntity } from '@app/modules/conversation/conversation.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(ConversationEntity)
export class ConversationRepository extends BaseRepository<ConversationEntity> {
  async getByParticipantId(participantId: number, userId: number): Promise<any | undefined> {
    const qb = this.createQueryBuilder('conversations');

    return qb
      .where(':userId = ANY(conversations.participantsIds)', { userId })
      .andWhere(':participantId = ANY(conversations.participantsIds)', { participantId })
      .getOne();
  }

  async getAllByParticipantId(id: number): Promise<ConversationEntity[] | undefined> {
    const qb = this.createQueryBuilder('conversations');

    return qb
      .where(':id = ANY(conversations.participantsIds)', { id })
      .orderBy({
        'conversations.updatedAt': 'DESC',
      })
      .getMany();
  }
}
