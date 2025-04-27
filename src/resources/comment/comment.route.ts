import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { Comment } from '@prisma/client';
import { commentService } from './comment.service';

const router = express.Router();

type CreateCommentInput = Omit<Comment, 'Id' | 'CreatedAt' | 'UpdatedAt'>;
type UpdateCommentInput = Partial<Omit<Comment, 'Id' | 'CreatedAt' | 'UpdatedAt'>>;

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           description: The auto-generated ID of the comment
 *         Text:
 *           type: string
 *           description: The text of the comment
 *         PostId:
 *           type: string
 *           description: The ID of the post the comment belongs to
 *         UserId:
 *           type: string
 *           description: The ID of the user who created the comment
 *         Post:
 *           $ref: '#/components/schemas/Post'
 *         User:
 *           $ref: '#/components/schemas/User'
 *         CreatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the comment was created
 *         UpdatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the comment was last updated
 *       required:
 *         - Id
 *         - Text
 *         - PostId
 *         - UserId
 *         - CreatedAt
 *         - UpdatedAt
 *     CreateCommentInput:
 *       type: object
 *       properties:
 *         Text:
 *           type: string
 *           description: The text of the comment
 *         PostId:
 *           type: string
 *           description: The ID of the post the comment belongs to
 *         UserId:
 *           type: string
 *           description: The ID of the user who created the comment
 *       required:
 *         - Text
 *         - PostId
 *         - UserId
 *     UpdateCommentInput:
 *       type: object
 *       properties:
 *         Text:
 *           type: string
 *           description: The text of the comment
 *         PostId:
 *           type: string
 *           description: The ID of the post the comment belongs to
 *         UserId:
 *           type: string
 *           description: The ID of the user who created the comment
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const comments = await commentService.getAllComments();
    res.status(200).json(comments);
  })
);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: The comment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Comment ID is required
 *       404:
 *         description: Comment not found
 */
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

/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Get all comments by post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: List of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Post ID is required
 *       404:
 *         description: Post not found
 */
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

/**
 * @swagger
 * /comments/user/{userId}:
 *   get:
 *     summary: Get all comments by user ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of comments by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User not found
 */
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

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentInput'
 *     responses:
 *       201:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Post or user not found
 */
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

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentInput'
 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error or comment ID is required
 *       404:
 *         description: Comment not found
 */
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

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       400:
 *         description: Comment ID is required
 *       404:
 *         description: Comment not found
 */
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
