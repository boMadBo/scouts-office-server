import { BaseRepository } from '@app/common/base.repository';
import { UserEntity } from '@app/modules/user/user.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
  async findOneById(id: string): Promise<UserEntity | undefined> {
    const qb = this.createQueryBuilder('users');

    return qb
      .leftJoinAndSelect(`${qb.alias}.conversations`, 'conversations')
      .where(`${qb.alias}.id = :id`, { id })
      .getOne();
  }
}