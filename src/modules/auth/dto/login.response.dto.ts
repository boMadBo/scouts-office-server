import { IsNumber, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name?: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsNumber()
  expiresIn: number;
}
