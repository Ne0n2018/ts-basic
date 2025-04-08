// src/routes/post.routes.ts

import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { Post } from '@prisma/client';
import { postService } from './post.service';

const router = express.Router();

type CreatePostInput = Omit<Post, 'Id' | 'CreatedAt' | 'UpdatedAt'>;
type UpdatePostInput = Partial<Omit<Post, 'Id' | 'CreatedAt' | 'UpdatedAt'>>;

// Получение всех постов
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  })
);

// Получение поста по ID
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }
    const post = await postService.getPostById(id);
    res.status(200).json(post);
  })
);

// Получение всех постов конкретного пользователя
router.get(
  '/user/:userId',
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const posts = await postService.getPostsByUserId(userId);
    res.status(200).json(posts);
  })
);

// Создание поста
router.post(
  '/',
  [
    body('Title').isString().notEmpty().withMessage('Title must be a non-empty string'),
    body('UserId').isString().notEmpty().withMessage('UserId must be a non-empty string'),
    body('Text').isString().notEmpty().withMessage('text must be not empty string'),
  ],
  asyncHandler(async (req: Request<object, object, CreatePostInput>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const postData: CreatePostInput = req.body;
    const newPost = await postService.createPost(postData);
    res.status(201).json(newPost);
  })
);

// Обновление поста
router.put(
  '/:id',
  [
    body('Title').optional().isString().notEmpty().withMessage('Title must be a non-empty string'),
    body('UserId')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('UserId must be a non-empty string'),
    body('Text').optional().isString().withMessage('text must be string'),
    body('Id').not().exists().withMessage('Id field is not allowed'),
    body('CreatedAt').not().exists().withMessage('CreatedAt field is not allowed'),
    body('UpdatedAt').not().exists().withMessage('UpdatedAt field is not allowed'),
  ],
  asyncHandler(async (req: Request<{ id: string }, object, UpdatePostInput>, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ error: 'At least one field must be provided for update' });
      return;
    }

    const updatedPost = await postService.updatePost(id, req.body);
    res.status(200).json(updatedPost);
  })
);

// Удаление поста
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }
    const result = await postService.deletePost(id);
    res.status(200).json({ message: 'Post deleted', id: result.id });
  })
);

export default router;
