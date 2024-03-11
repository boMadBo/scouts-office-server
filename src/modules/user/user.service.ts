import { ICreateUserParams } from '@app/modules/user/types';
import { UserEntity } from '@app/modules/user/user.entity';
import { UserRepository } from '@app/modules/user/user.repository';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MoreThan } from 'typeorm';

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

  async login(email: string, password: string): Promise<UserEntity> {
    const user = await this.getByEmailOrFail(email);
    await this.validateHash(password, user.password);

    return user;
  }

  async getByEmailOrFail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findByToken(token: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: {
        token,
        tokenExpiredAt: MoreThan(new Date()),
      },
    });
  }

  generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  private async validateHash(password: string, hash: string, customErrorMessage?: string): Promise<void> {
    let result = false;

    try {
      result = await bcrypt.compare(password, hash);
    } catch (e) {
      throw new ForbiddenException(customErrorMessage || 'Неверный логин/пароль');
    }

    if (!result) {
      throw new ForbiddenException(customErrorMessage || 'Неверный логин/пароль');
    }
  }
}
