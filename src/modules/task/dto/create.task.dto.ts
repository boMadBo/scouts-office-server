import { IsBoolean, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  text: string;

  @IsBoolean()
  completed: boolean = false;
}
