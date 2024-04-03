import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UtcZoneUpdateDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}
