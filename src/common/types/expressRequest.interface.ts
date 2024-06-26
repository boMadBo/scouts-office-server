import { UserEntity } from '@app/modules/user/user.entity';
import { Request } from 'express';

export interface ExpressRequest extends Request {
  user?: UserEntity;
  token?: string;
}
