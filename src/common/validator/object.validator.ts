import { ValidationError } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class ObjectValidator {
  static async validateDto<T extends ClassConstructor<any>>(dto: T, obj: Record<string, unknown>): Promise<void> {
    const classObject = plainToClass(dto, obj);
    const errors: ValidationError[] = await validate(classObject);

    if (errors.length > 0) {
      throw new TypeError(
        `Validation errors: ${errors
          .map(({ property, constraints }) => {
            let validationConstraint;
            if (constraints) {
              validationConstraint = Object.values(constraints).join(', ').trim();
            }
            return `'${property}': ${validationConstraint}`;
          })
          .join(', ')}`
      );
    }
  }
}
