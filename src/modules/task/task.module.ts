import { TaskController } from '@app/modules/task/task.controller';
import { TaskRepository } from '@app/modules/task/task.repository';
import { TaskService } from '@app/modules/task/task.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  controllers: [TaskController],
  exports: [TaskService],
  providers: [TaskService],
})
export class TaskModule {}
