// src/routes/comment.routes.ts

import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { Comment } from '@prisma/client';
import { commentService } from './comment.service';

const router = express.Router();

type CreateCommentInput = Omit<Comment, 'Id' | 'CreatedAt' | 'UpdatedAt'>;
type UpdateCommentInput = Partial<Omit<Comment, 'Id' | 'CreatedAt' | 'UpdatedAt'>>;

// Получение всех комментариев
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const comments = await commentService.getAllComments();
    res.status(200).json(comments);
  })
);

// Получение комментария по ID
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Comment ID is required' });
      return;
    }
    const comment = await commentService.getCommentById(id);
    res.status(200).json(comment);
  })
);

// Получение всех комментариев по ID поста
router.get(
  '/post/:postId',
  asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    if (!postId) {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }
    const comments = await commentService.getCommentsByPostId(postId);
    res.status(200).json(comments);
  })
);

// Получение всех комментариев по ID пользователя
router.get(
  '/user/:userId',
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const comments = await commentService.getCommentsByUserId(userId);
    res.status(200).json(comments);
  })
);

// Создание комментария
router.post(
  '/',
  [
    body('Text').isString().notEmpty().withMessage('Text must be a non-empty string'),
    body('PostId').isString().notEmpty().withMessage('PostId must be a non-empty string'),
    body('UserId').isString().notEmpty().withMessage('UserId must be a non-empty string'),
  ],
  asyncHandler(async (req: Request<object, object, CreateCommentInput>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const commentData: CreateCommentInput = req.body;
    const newComment = await commentService.createComment(commentData);
    res.status(201).json(newComment);
  })
);

// Обновление комментария
router.put(
  '/:id',
  [
    body('Text').optional().isString().notEmpty().withMessage('Text must be a non-empty string'),
    body('PostId')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('PostId must be a non-empty string'),
    body('UserId')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('UserId must be a non-empty string'),
    body('Id').not().exists().withMessage('Id field is not allowed'),
    body('CreatedAt').not().exists().withMessage('CreatedAt field is not allowed'),
    body('UpdatedAt').not().exists().withMessage('UpdatedAt field is not allowed'),
  ],
  asyncHandler(async (req: Request<{ id: string }, object, UpdateCommentInput>, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Comment ID is required' });
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

    const updatedComment = await commentService.updateComment(id, req.body);
    res.status(200).json(updatedComment);
  })
);

// Удаление комментария
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Comment ID is required' });
      return;
    }
    const result = await commentService.deleteComment(id);
    res.status(200).json({ message: 'Comment deleted', id: result.id });
  })
);

export default router;
