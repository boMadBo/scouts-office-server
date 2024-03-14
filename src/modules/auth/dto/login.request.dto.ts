import { IsEmail, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsEmail()
  // @Transform(email => email.toLowerCase())
  email: string;

  @IsString()
  password: string;
}
