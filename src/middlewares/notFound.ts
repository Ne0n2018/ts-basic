import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../classes/appError.class';

export default (_req: Request, _res: Response, next: NextFunction): void =>
  next(new AppError(StatusCodes.NOT_FOUND, 'NOT_FOUND', 'NOT_FOUND'));
