import { AuthUser } from '@app/common/decorators/authUser.decorator';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { CreateTaskDto } from '@app/modules/task/dto/create.task.dto';
import { TaskDto } from '@app/modules/task/dto/task.dto';
import { UpdateTaskDto } from '@app/modules/task/dto/update.task.dto';
import { TaskEntity } from '@app/modules/task/task.entity';
import { TaskService } from '@app/modules/task/task.service';
import { UserEntity } from '@app/modules/user/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async create(@AuthUser() user: UserEntity, @Body() dto: CreateTaskDto): Promise<TaskDto> {
    const task = await this.taskService.create(dto, user.id);
    return TaskController.mapToDto(task);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async list(@AuthUser() user: UserEntity): Promise<TaskDto[]> {
    const tasks = await this.taskService.list(user.id);
    return tasks.map(TaskController.mapToDto);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @AuthUser() user: UserEntity,
    @Body() dto: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<TaskDto> {
    const task = await this.taskService.updateTask(user.id, dto, id);
    return TaskController.mapToDto(task);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@AuthUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.deleteTask(user.id, id);
  }

  static mapToDto(entity: TaskEntity): TaskDto {
    const dto = new TaskDto();

    dto.id = entity.id;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.text = entity.text;
    dto.completed = entity.completed;

    return dto;
  }
}
