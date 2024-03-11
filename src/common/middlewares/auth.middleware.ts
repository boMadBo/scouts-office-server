import { ExpressRequest } from '@app/common/types/expressRequest.interface';
import { UserService } from '@app/modules/user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(public readonly userService: UserService) {}

  async use(req: ExpressRequest, _: Response, next: NextFunction): Promise<void> {
    if (!req.headers.authorization) {
      req.user = undefined;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const user = await this.userService.findByToken(token);

    if (user) {
      req.user = user;
    }

    next();
  }
}
