import { IsDate, IsNumber } from 'class-validator';

export class BaseDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
