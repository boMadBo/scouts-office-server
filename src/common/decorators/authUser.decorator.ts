import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const AuthUser = createParamDecorator(
  (_data, request: ExecutionContextHost) => request.switchToHttp().getRequest().user
);
export const AuthToken = createParamDecorator(
  (_data, request: ExecutionContextHost) => request.switchToHttp().getRequest().token
);
