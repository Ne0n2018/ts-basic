import { Request, Response } from 'express';
import { PostRequestBody, PostRequestParams } from 'types/express';
import * as postService from './post.service';

const handleError = (res: Response, error: Error, status = 500): void => {
  res.status(status).json({ error: error.message });
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await postService.getAll());
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getById = async (
  req: Request<PostRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const post = await postService.getById(req.params.postId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const create = async (
  req: Request<void, void, PostRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const newPost = await postService.creat(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const update = async (
  req: Request<PostRequestParams, void, PostRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const updatedPost = await postService.update(req.params.postId, req.body);
    if (updatedPost) {
      res.json(updatedPost);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const deletePost = async (
  req: Request<PostRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const deletedPost = await postService.deleted(req.params.postId);
    if (deletedPost) {
      res.json(deletedPost);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};
