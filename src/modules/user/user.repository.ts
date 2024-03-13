import { BaseRepository } from '@app/common/base.repository';
import { UserEntity } from '@app/modules/user/user.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {}