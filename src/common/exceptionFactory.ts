import { UnprocessableEntityException, ValidationError } from '@nestjs/common';

export function exceptionFactory(validationErrors: ValidationError[]): any {
  const errors = validationErrors.reduce(createError, {});

  return new UnprocessableEntityException({
    message: 'The given data was invalid.',
    errors: errors,
  });
}

function createError(result: Record<any, any>, item: ValidationError) {
  result[item.property] = Object.values(item.constraints || {});

  if (item.children && item.children.length > 0) {
    if (result[item.property].length > 0) result[item.property].push(item.children.reduce(createError, {}));
    else result[item.property] = item.children.reduce(createError, {});
  }

  return result;
}
