import { BaseDto } from '@app/common/dto/base.dto';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class TaskDto extends BaseDto {
  @IsString()
  text: string;

  @IsBoolean()
  completed: boolean = false;

  @IsNumber()
  userId: number;
}
