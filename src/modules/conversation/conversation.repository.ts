import { BaseRepository } from '@app/common/base.repository';
import { ConversationEntity } from '@app/modules/conversation/conversation.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(ConversationEntity)
export class ConversationRepository extends BaseRepository<ConversationEntity> {
  async getByParticipantId(id: number): Promise<any | undefined> {
    const qb = this.createQueryBuilder('conversations');

    return qb.where(':id = ANY(conversations.participantsIds)', { id }).getOne();
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
