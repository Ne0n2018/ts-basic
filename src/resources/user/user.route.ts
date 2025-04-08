// src/routes/user.routes.ts

import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { CreateUserInput, UpdateUserInput } from 'types/input.type';
import { userService } from './user.service';

const router = express.Router();

// Получить всех пользователей
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  })
);

// Создать пользователя
router.post(
  '/',
  asyncHandler(async (req: Request<void, void, CreateUserInput>, res: Response) => {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  })
);

// Обновить пользователя
router.put(
  '/:id',
  asyncHandler(async (req: Request<{ id: string }, void, UpdateUserInput>, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const updatedUser = await userService.updateUser(id, req.body);
    res.status(200).json(updatedUser);
  })
);

// Удалить пользователя
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    await userService.deleteUser(id);
    res.status(204).send();
  })
);

export default router;
