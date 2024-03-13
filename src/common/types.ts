import { EOrderDirection } from '@app/common/enums';

export interface IListResult<T> {
  data: T[];
  count: number;
}

export interface IBaseListFilters {
  offset?: number;
  limit?: number;
  orderDirection?: EOrderDirection;
}

export interface IRawBaseEntity {
  id: number;
  created_at: Date;
  updated_at: Date;
}
