import { BaseFiltersDto } from '@app/common/dto/base.filters.dto';
import { EUserSort } from '@app/modules/user/enums';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

export class UserFiltersDto extends BaseFiltersDto {
  @IsArray()
  ids?: number[];

  @IsOptional()
  @IsEnum(EUserSort)
  orderField: EUserSort = EUserSort.CreatedAt;
}
