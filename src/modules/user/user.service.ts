import { ICreateUserParams } from '@app/modules/user/types';
import { UserEntity } from '@app/modules/user/user.entity';
import { UserRepository } from '@app/modules/user/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create({ password, birthDate, ...user }: ICreateUserParams): Promise<UserEntity> {
    const existed = await this.userRepository.findOne({ where: { email: user.email } });

    if (existed) {
      throw new BadRequestException('Пользователь с таким адресом электронной почты существует');
    }

    const entity = this.userRepository.create({
      ...user,
      ...(birthDate && { birthDate: new Date(birthDate) }),
      ...(password && { password: this.generateHash(password) }),
    });

    return this.userRepository.save(entity);
  }

  generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
