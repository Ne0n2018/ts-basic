import { StatusCodes } from 'http-status-codes';
import { Request, NextFunction } from 'express';

import { CustomResponse } from 'interfaces/errorLoger.interface';
import AppError from '../classes/appError.class';
import logger from '../common/logger';

export const errorLogger = (
  error: Error,
  _req: Request,
  res: CustomResponse,
  next: NextFunction
): void => {
  if (error instanceof AppError) {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'ERROR';
    const code = error.code || 'SERVER_ERROR';

    const message = error.message || 'Error';

    res.errorMessage = message;
    logger.error(`${status} ${error.message}`);
    res.status(statusCode).json({ status, code, message });
  } else {
    res.errorMessage = error.message || 'Error';
    logger.error(`${error.message}\n${error.stack}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }

  next();
};
