import { AuthUser } from '@app/common/decorators/authUser.decorator';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { CreateUserDto } from '@app/modules/user/dto/create.user.dto';
import { UpdateUserDto } from '@app/modules/user/dto/update.user.dto';
import { UserFiltersDto } from '@app/modules/user/dto/user.filters.dto';
import { IUser } from '@app/modules/user/types';
import { UserEntity } from '@app/modules/user/user.entity';
import { UserService } from '@app/modules/user/user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/registration')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads/',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = path.extname(file.originalname);
          const fileName = uniqueSuffix + fileExtension;
          cb(null, fileName);
        },
      }),
    })
  )
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File): Promise<UserEntity> {
    return this.userService.create(createUserDto, file?.filename);
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getCurrent(@AuthUser() user: UserEntity): Promise<IUser> {
    return this.userService.getCurrentUserById(user.id);
  }

  @Get('/list')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async list(@Query() query: UserFiltersDto): Promise<IUser[]> {
    return this.userService.list(query);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads/',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = path.extname(file.originalname);
          const fileName = uniqueSuffix + fileExtension;
          cb(null, fileName);
        },
      }),
    })
  )
  async updateUser(
    @AuthUser() user: UserEntity,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<IUser> {
    return this.userService.updateUser(user, dto, file?.filename);
  }
}
