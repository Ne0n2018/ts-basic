// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { adminService } from '../resources/admin/admin.service';

interface JwtPayload {
  id: string;
  name: string;
  role: string;
}

// Асинхронная логика middleware
const authMiddlewareAsync = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
    return;
  }

  const secret = process.env['JWT_SECRET'] || 'your_jwt_secret';

  try {
    // Проверяем, не находится ли токен в blacklist
    const tokenExists = await adminService.tokenExists(token);
    if (!tokenExists) {
      res.status(401).json({ error: 'Unauthorized - Token has been invalidated' });
      return;
    }

    // Проверяем валидность токена
    const payload = jwt.verify(token, secret) as JwtPayload;
    (req as Request & { admin?: JwtPayload }).admin = payload;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

// Обёртка для преобразования асинхронного middleware в синхронный
export const authMiddleware: RequestHandler = (req, res, next) => {
  authMiddlewareAsync(req, res, next).catch(next);
};
