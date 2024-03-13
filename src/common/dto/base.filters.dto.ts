import { EOrderDirection } from '@app/common/enums';
import { IBaseListFilters } from '@app/common/types';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class BaseFiltersDto implements IBaseListFilters {
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(EOrderDirection)
  orderDirection?: EOrderDirection = EOrderDirection.Desc;
}
