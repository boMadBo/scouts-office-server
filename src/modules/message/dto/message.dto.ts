import { BaseDto } from '@app/common/dto/base.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageDto extends BaseDto {
  @IsNumber()
  senderId: number;

  @IsNumber()
  recieverId: number;

  @IsString()
  text: string;

  @IsNumber()
  conversationId: number;

  @IsString()
  @IsOptional()
  senderName?: string;

  @IsString()
  @IsOptional()
  recieverName?: string;

  @IsBoolean()
  isReaded: boolean;
}
