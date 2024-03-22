import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  senderId: number;

  @IsNumber()
  recieverId: number;

  @IsString()
  text: string;

  @IsNumber()
  conversationId: number;
}
