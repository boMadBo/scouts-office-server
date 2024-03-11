import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  password: string;

  @IsString()
  country: string;

  @IsString()
  name: string;

  @IsString()
  birthDate: string;

  @IsOptional()
  avatar?: Buffer;
}