import { BaseRepository } from '@app/common/base.repository';
import { TaskEntity } from '@app/modules/task/task.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(TaskEntity)
export class TaskRepository extends BaseRepository<TaskEntity> {}
