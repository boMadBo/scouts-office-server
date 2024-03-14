import { BaseEntity } from '@app/common/base.entity';
import { UserEntity } from '@app/modules/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity {
  @Column()
  text: string;

  @Column()
  completed: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, user => user.tasks, { onDelete: 'RESTRICT' })
  user: UserEntity;
}
