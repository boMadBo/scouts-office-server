import { BaseDto } from '@app/common/dto/base.dto';
import { IUserValues } from '@app/modules/conversation/types';

export class ConversationDto extends BaseDto {
  user: IUserValues;
  interlocutor: IUserValues;
}
