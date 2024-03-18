import { ConversationEntity } from '@app/modules/conversation/conversation.entity';
import { TaskEntity } from '@app/modules/task/task.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  birthDate: Date;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  tokenExpiredAt?: Date;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  refreshTokenExpiredAt?: Date;

  @OneToMany(() => TaskEntity, task => task.user)
  tasks: TaskEntity[];

  @Column({ type: 'jsonb', default: '[]' })
  observations: string[];

  @ManyToMany(() => ConversationEntity, conversation => conversation.users, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinTable()
  conversations: ConversationEntity[];
}
