import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import ValidateError from '../classes/validationError.class';

export default (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  const error = errors.array().pop();

  if (error && typeof error.msg === 'string') {
    next(new ValidateError(error.msg));
  } else {
    next(new ValidateError('Unknown validation error'));
  }
};
