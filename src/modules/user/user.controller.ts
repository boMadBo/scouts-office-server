import { CreateUserDto } from '@app/modules/user/dto/create.user.dto';
import { UserService } from '@app/modules/user/user.service';
import { Body, Controller, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/registration')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      createUserDto.avatar = file.buffer;
    }

    return this.userService.create(createUserDto);
  }
}