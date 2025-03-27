import { Request, Response } from 'express';
import { CommentRequestBody, CommentRequestParams } from 'types/express';
import * as commentService from './comment.service';

const handleError = (res: Response, error: Error, status = 500): void => {
  res.status(status).json({ error: error.message });
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await commentService.getAll());
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getById = async (
  req: Request<CommentRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const comment = await commentService.getById(req.params.commentId);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const create = async (
  req: Request<void, void, CommentRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const newComment = await commentService.creat(req.body);
    res.status(201).json(newComment);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const update = async (
  req: Request<CommentRequestParams, void, CommentRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const updatedComment = await commentService.update(req.params.commentId, req.body);
    if (updatedComment) {
      res.json(updatedComment);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};
export const deleteComment = async (
  req: Request<CommentRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const deletedComment = await commentService.deleted(req.params.commentId);
    if (deletedComment) {
      res.json(deletedComment);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};
