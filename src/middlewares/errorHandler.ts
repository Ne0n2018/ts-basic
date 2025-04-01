import { Request, Response, NextFunction } from 'express';
import AppError from '../classes/appError.class';

export default (err: AppError, _req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'ERROR';
  const code = err.code || 'SERVER_ERROR';

  const message = err.message || '';

  res.status(statusCode).json({ status, code, message });

  next();
};
