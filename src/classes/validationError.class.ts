import { StatusCodes } from 'http-status-codes';

import AppError from './appError.class';

class ValidateError extends AppError {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, 'VALIDATION_ERROR', message);
  }
}

export default ValidateError;
