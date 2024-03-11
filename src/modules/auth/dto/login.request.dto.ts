import { IsEmail, IsString } from 'class-validator';

export class LoginRequest {
  @IsString()
  @IsEmail()
  // @Transform(email => email.toLowerCase())
  email: string;

  @IsString()
  password: string;
}
