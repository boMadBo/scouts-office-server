import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';


@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  birthDate: Date;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  tokenExpiredAt?: Date;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  refreshTokenExpiredAt?: Date;
}