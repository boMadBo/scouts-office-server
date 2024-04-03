import { BaseDto } from '@app/common/dto/base.dto';
import { IUtcZone } from '@app/modules/user/types';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

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

  @IsArray()
  observations: string[];

  @IsString()
  @IsOptional()
  token?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsArray()
  utcZones: IUtcZone[];
}
