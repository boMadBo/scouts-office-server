import { AuthUser } from '@app/common/decorators/authUser.decorator';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { AuthService } from '@app/modules/auth/auth.service';
import { LoginRequestDto } from '@app/modules/auth/dto/login.request.dto';
import { LoginResponseDto } from '@app/modules/auth/dto/login.response.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(email.toLowerCase(), password);
  }

  @Delete('/logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async userLogout(@AuthUser() user: UserEntity): Promise<void> {
    return this.authService.logout(user);
  }
}
