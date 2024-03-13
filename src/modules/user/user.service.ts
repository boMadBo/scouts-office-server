import { config } from '@app/config';
import { UserFiltersDto } from '@app/modules/user/dto/user.filters.dto';
import { ICreateUserParams, IUser } from '@app/modules/user/types';
import { UserEntity } from '@app/modules/user/user.entity';
import { UserRepository } from '@app/modules/user/user.repository';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MoreThan } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create({ password, birthDate, ...user }: ICreateUserParams, fileName?: string): Promise<UserEntity> {
    const existed = await this.userRepository.findOne({ where: { email: user.email } });

    if (existed) {
      throw new BadRequestException('A user with this email address exists');
    }

    if (fileName) {
      user.avatarUrl = fileName;
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

  async logout(id: number): Promise<void> {
    const user = await this.getByIdOrFail(id);
    delete user.token;
    delete user.refreshToken;

    await user.save();
  }

  async list(filters: UserFiltersDto): Promise<IUser[]> {
    const users = await this.userRepository.find();
    const usersData = users.map(user => {
      return this.getUserWithAvatar(user);
    });
    return usersData;
  }

  async getByIdOrFail(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getByEmailOrFail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getCurrentUserById(id: number): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.getUserWithAvatar(user);
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
      throw new ForbiddenException(customErrorMessage || 'Invalid username/password');
    }

    if (!result) {
      throw new ForbiddenException(customErrorMessage || 'Invalid username/password');
    }
  }

  private getUserWithAvatar(user: UserEntity): IUser {
    const userData: IUser = {
      id: user.id,
      email: user.email,
      country: user.country,
      name: user.name,
      birthDate: user.birthDate,
    };

    if (user?.avatarUrl) {
      userData.avatar = config.uploadUrl + user.avatarUrl;
    }

    return userData;
  }
}
