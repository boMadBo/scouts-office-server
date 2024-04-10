import { AuthUser } from '@app/common/decorators/authUser.decorator';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { config } from '@app/config';
import { IPlayer } from '@app/modules/outward/types';
import { CreateUserDto } from '@app/modules/user/dto/create.user.dto';
import { UpdateUserDto } from '@app/modules/user/dto/update.user.dto';
import { UtcZoneUpdateDto } from '@app/modules/user/dto/update.weather.dto';
import { UserDto } from '@app/modules/user/dto/user.dto';
import { UserObservationsDto } from '@app/modules/user/dto/user.observations.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { UserService } from '@app/modules/user/user.service';
import { multerOptions } from '@app/multer.options';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/registration')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File): Promise<UserDto> {
    const user = await this.userService.create(createUserDto, file?.filename);
    return UserController.mapToDto(user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getCurrent(@AuthUser() user: UserEntity): Promise<UserDto> {
    const currentUser = await this.userService.getByIdOrFail(user.id);
    return UserController.mapToDto(currentUser);
  }

  @Get('/list')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async list(): Promise<UserDto[]> {
    const users = await this.userService.list();
    return users.map(UserController.mapToDto);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateUser(
    @AuthUser() user: UserEntity,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<UserDto> {
    const updateUser = await this.userService.updateUser(user, dto, file?.filename);
    return UserController.mapToDto(updateUser);
  }

  @Post('/observation')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async createObservation(@AuthUser() user: UserEntity, @Body() dto: UserObservationsDto): Promise<UserDto> {
    const updateUser = await this.userService.createObservation(user.id, dto);
    return UserController.mapToDto(updateUser);
  }

  @Get('/observation')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async observationsList(@AuthUser() user: UserEntity): Promise<IPlayer[]> {
    return this.userService.observationsList(user.id);
  }

  @Delete('/observation')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteObservation(@AuthUser() user: UserEntity, @Body() dto: UserObservationsDto): Promise<UserDto> {
    const updateUser = await this.userService.deleteObservation(user.id, dto);
    return UserController.mapToDto(updateUser);
  }

  @Put('/timezones')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateUtcZones(@AuthUser() user: UserEntity, @Body() dto: UtcZoneUpdateDto[]): Promise<UserDto> {
    const updateUser = await this.userService.updateUtcZones(user, dto);
    return UserController.mapToDto(updateUser);
  }

  static mapToDto(entity: UserEntity): UserDto {
    const dto = new UserDto();

    dto.id = entity.id;
    dto.email = entity.email;
    dto.country = entity.country;
    dto.name = entity.name;
    dto.birthDate = entity.birthDate.toString();
    dto.observations = entity.observations;
    dto.token = entity.token;
    dto.refreshToken = entity.refreshToken;
    dto.utcZones = entity.utcZones;
    if (entity.avatarUrl) {
      dto.avatar = config.uploadUrl + entity.avatarUrl;
    }

    return dto;
  }
}
