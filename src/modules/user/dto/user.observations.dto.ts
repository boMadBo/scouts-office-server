import { IsString } from 'class-validator';

export class UserObservationsDto {
  @IsString()
  playerId: string;
}
