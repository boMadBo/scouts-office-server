import { BaseEntity } from '@app/common/base.entity';
import { Repository } from 'typeorm';

export abstract class BaseRepository<T> extends Repository<T & BaseEntity> {}
