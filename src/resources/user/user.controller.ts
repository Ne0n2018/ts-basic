import { Request, Response } from 'express';
import { UserRequestBody, UserRequestParams } from 'types/express';
import * as userService from './user.service';

const handleError = (res: Response, error: Error, status = 500): void => {
  res.status(status).json({ error: error.message });
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await userService.getAll());
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getById = async (
  req: Request<UserRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const user = await userService.getById(req.params.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const create = async (
  req: Request<void, void, UserRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const newUser = await userService.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    handleError(res, error as Error, 400);
  }
};

export const update = async (
  req: Request<UserRequestParams, void, UserRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const updatedUser = await userService.update(req.params.userId, req.body);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    handleError(res, error as Error, 400);
  }
};

export const deleteById = async (
  req: Request<UserRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const isDeleted = await userService.deleteById(req.params.userId);
    if (isDeleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};
