import { OutwardService } from '@app/modules/outward/outward.service';
import { IPlayer } from '@app/modules/outward/types';
import { CreateUserDto } from '@app/modules/user/dto/create.user.dto';
import { UpdateUserDto } from '@app/modules/user/dto/update.user.dto';
import { UtcZoneUpdateDto } from '@app/modules/user/dto/update.weather.dto';
import { UserObservationsDto } from '@app/modules/user/dto/user.observations.dto';
import { IUpdateUserParams } from '@app/modules/user/types';
import { UserEntity } from '@app/modules/user/user.entity';
import { UserRepository } from '@app/modules/user/user.repository';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { MoreThan } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly outwardService: OutwardService
  ) {}

  async create({ password, birthDate, ...user }: CreateUserDto, fileName?: string): Promise<UserEntity> {
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
    user.token = undefined;
    user.refreshToken = undefined;

    await user.save();
  }

  async list(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async updateUser(user: UserEntity, params: UpdateUserDto, fileName?: string): Promise<UserEntity> {
    let currentUser = await this.getByIdOrFail(user.id);

    const entity: IUpdateUserParams = {};

    if (fileName) {
      if (currentUser && currentUser.avatarUrl) {
        const filePath = path.join('./src/uploads/', currentUser.avatarUrl.toString());
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      entity.avatarUrl = fileName;
    }

    if (params.password) {
      entity.password = this.generateHash(params.password);
    }

    if (params.name) {
      entity.name = params.name;
    }

    if (params.email) {
      entity.email = params.email;
    }

    currentUser = this.userRepository.merge(currentUser, entity);
    await currentUser.save();
    return this.getByIdOrFail(user.id);
  }

  async createObservation(userId: number, params: UserObservationsDto): Promise<UserEntity> {
    const currentUser = await this.getByIdOrFail(userId);

    currentUser.observations = [...currentUser.observations, params.playerId];
    await currentUser.save();
    return this.getByIdOrFail(userId);
  }

  async observationsList(userId: number): Promise<IPlayer[]> {
    const currentUser = await this.getByIdOrFail(userId);
    return Promise.all(currentUser.observations.map(async item => this.outwardService.getPlayer(item)));
  }

  async deleteObservation(userId: number, params: UserObservationsDto): Promise<UserEntity> {
    const currentUser = await this.getByIdOrFail(userId);

    currentUser.observations = currentUser.observations.filter(item => item !== params.playerId);
    await currentUser.save();
    return this.getByIdOrFail(userId);
  }

  async updateUtcZones(user: UserEntity, params: UtcZoneUpdateDto[]): Promise<UserEntity> {
    const currentUser = await this.getByIdOrFail(user.id);

    params.forEach(param => {
      const zoneIndex = currentUser.utcZones.findIndex(zone => zone.id === param.id);
      if (zoneIndex !== -1) {
        const updatedZone = { ...currentUser.utcZones[zoneIndex] };
        if (param.isActive !== undefined) {
          updatedZone.isActive = param.isActive;
        }
        if (param.order !== undefined) {
          updatedZone.order = param.order;
        }
        currentUser.utcZones[zoneIndex] = updatedZone;
      }
    });
    currentUser.utcZones.sort((a, b) => a.order - b.order);

    await currentUser.save();

    return this.getByIdOrFail(user.id);
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

  async getByIds(ids: number[]): Promise<UserEntity[]> {
    const users = await this.userRepository.findByIds(ids);

    if (!users) {
      throw new NotFoundException('Users not found');
    }

    return users;
  }

  async findByToken(token: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: {
        token,
        tokenExpiredAt: MoreThan(new Date()),
      },
    });
  }

  async getUserByRefreshToken(refreshToken: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { refreshToken },
    });

    if (!user || (user.refreshTokenExpiredAt && user.refreshTokenExpiredAt < new Date())) {
      throw new UnauthorizedException('Incorrect refresh token');
    }

    return user;
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
}
