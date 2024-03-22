import { BaseEntity } from '@app/common/base.entity';
import { ConversationEntity } from '@app/modules/conversation/conversation.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'messages' })
export class MessageEntity extends BaseEntity {
  @Column({ type: 'int' })
  senderId: number;

  @Column({ type: 'int' })
  recieverId: number;

  @Column()
  text: string;

  @Column({ default: false })
  isReaded: boolean;

  @Column({ type: 'int' })
  conversationId: number;

  @ManyToOne(() => ConversationEntity, conversations => conversations.messages, { onDelete: 'CASCADE' })
  conversation: ConversationEntity;
}
