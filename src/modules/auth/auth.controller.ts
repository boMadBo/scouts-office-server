import { AuthUser } from '@app/common/decorators/authUser.decorator';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { AuthService } from '@app/modules/auth/auth.service';
import { LoginGoogleDto } from '@app/modules/auth/dto/login.google.dto';
import { LoginRequestDto } from '@app/modules/auth/dto/login.request.dto';
import { LoginResponseDto } from '@app/modules/auth/dto/login.response.dto';
import { RefreshRequestDto } from '@app/modules/auth/dto/refresh.request.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'User info with access token',
  })
  async login(@Body() { email, password }: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(email.toLowerCase(), password);
  }

  @Post('/login/google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() { code }: LoginGoogleDto): Promise<LoginResponseDto> {
    return this.authService.googleLogin(code);
  }

  @Put('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'Refresh user token pair by refresh token',
  })
  async refreshTokens(@Body() { refreshToken }: RefreshRequestDto): Promise<LoginResponseDto> {
    return this.authService.refreshTokens(refreshToken);
  }

  @Delete('/logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async userLogout(@AuthUser() user: UserEntity): Promise<void> {
    return this.authService.logout(user);
  }
}
