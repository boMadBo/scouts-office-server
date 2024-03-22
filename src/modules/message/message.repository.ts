import { BaseRepository } from '@app/common/base.repository';
import { MessageEntity } from '@app/modules/message/message.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(MessageEntity)
export class MessageRepository extends BaseRepository<MessageEntity> {}
