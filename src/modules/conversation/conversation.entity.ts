import { BaseEntity } from '@app/common/base.entity';
import { UserEntity } from '@app/modules/user/user.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: 'conversations' })
export class ConversationEntity extends BaseEntity {
  @ManyToMany(() => UserEntity, user => user.conversations, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  users: UserEntity[];

  @Column('integer', { array: true, default: [] })
  participantsIds: number[];
}
