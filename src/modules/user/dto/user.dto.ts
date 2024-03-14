import { BaseDto } from '@app/common/dto/base.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto extends BaseDto {
  @IsEmail()
  email: string;

  @IsString()
  country: string;

  @IsString()
  name: string;

  @IsString()
  birthDate: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
