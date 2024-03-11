import { CreateUserDto } from '@app/modules/user/dto/create.user.dto';
import { UserService } from '@app/modules/user/user.service';
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/registration')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}