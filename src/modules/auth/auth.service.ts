import { config } from '@app/config';
import { LoginResponseDto } from '@app/modules/auth/dto/login.response.dto';
import { IGetTokens, ITokenPayload } from '@app/modules/auth/types';
import { UserEntity } from '@app/modules/user/user.entity';
import { UserService } from '@app/modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userService.login(email, password);

    return this.updateTokens(user);
  }

  async logout(user: UserEntity): Promise<void> {
    await this.userService.logout(user.id);
  }

  private async updateTokens(user: UserEntity): Promise<LoginResponseDto> {
    const tokens = await this.getTokens({ id: user.id, email: user.email });

    user.token = tokens.accessToken;
    user.tokenExpiredAt = moment().add(config.jwt.accessExpiration, 'seconds').toDate();
    user.refreshToken = tokens.refreshToken;
    user.refreshTokenExpiredAt = moment().add(config.jwt.refreshExpiration, 'seconds').toDate();
    await user.save();

    return {
      id: user.id,
      name: user.name,
      ...tokens,
    };
  }

  private async getTokens(payload: ITokenPayload): Promise<IGetTokens> {
    return {
      accessToken: await this.signToken(payload, config.jwt.accessExpiration),
      refreshToken: await this.signToken(payload, config.jwt.refreshExpiration),
      expiresIn: config.jwt.accessExpiration,
    };
  }

  private async signToken(payload: ITokenPayload, expiresIn: number): Promise<string> {
    return this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
      expiresIn,
    });
  }
}
