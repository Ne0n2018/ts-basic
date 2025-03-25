import { Request, Response, NextFunction } from 'express';

type AsyncFunction<
  P = Record<string, string>,
  ResBody = void,
  ReqBody = void
> = (
  req: Request<P, ResBody, ReqBody>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = <
  P = Record<string, string>,
  ResBody = void,
  ReqBody = void
>(fn: AsyncFunction<P, ResBody, ReqBody>) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Promise.resolve(fn(req as Request<P, ResBody, ReqBody>, res, next)).catch(next);
};
