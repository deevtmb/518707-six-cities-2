import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { MiddlewareInterface } from '../../types/middleware.interface.js';

export class ValidateDTOMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute({body}: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(errors);
      return;
    }

    next();
  }
}
