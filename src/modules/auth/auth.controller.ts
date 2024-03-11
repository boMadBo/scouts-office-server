import { AuthService } from '@app/modules/auth/auth.service';
import { LoginRequest } from '@app/modules/auth/dto/login.request.dto';
import { LoginResponse } from '@app/modules/auth/dto/login.response.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { email, password }: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(email.toLowerCase(), password);
  }
}
