import { CreateTaskDto } from '@app/modules/task/dto/create.task.dto';
import { UpdateTaskDto } from '@app/modules/task/dto/update.task.dto';
import { TaskEntity } from '@app/modules/task/task.entity';
import { TaskRepository } from '@app/modules/task/task.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  @Transactional()
  async create(params: CreateTaskDto, userId: number): Promise<TaskEntity> {
    const entity = this.taskRepository.create({
      ...params,
      userId,
    });

    return this.taskRepository.save(entity);
  }

  async list(userId: number): Promise<TaskEntity[]> {
    return this.taskRepository.find({
      where: { userId },
    });
  }

  async updateTask(userId: number, params: UpdateTaskDto, id: number): Promise<TaskEntity> {
    let task = await this.taskRepository.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task = this.taskRepository.merge(task, params);
    await task.save();
    return this.getByIdOrFail(task.id);
  }

  async deleteTask(userId: number, id: number): Promise<void> {
    let task = await this.taskRepository.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.remove(task);
  }

  async getByIdOrFail(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
