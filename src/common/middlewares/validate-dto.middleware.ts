import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import ValidationError from '../errors/validation-error.js';
import { transformErrors } from '../../utils/common.js';

export class ValidateDTOMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute({body, path}: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: "${path}"`, transformErrors(errors));
    }

    next();
  }
}
