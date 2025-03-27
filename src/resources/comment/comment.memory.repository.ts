import { IComment, ICommentDTO } from 'interfaces/comment.interface';
import { Comment } from './comment.model';

const comments: Comment[] = [];

export const getAll = async (): Promise<IComment[]> => [...comments];

export const getById = async (id: string): Promise<IComment | undefined> =>
  comments.find((comment) => comment.id === id);

export const creat = async (commentData: ICommentDTO): Promise<IComment> => {
  const newComment = new Comment(commentData);
  comments.push(newComment);
  return newComment;
};

export const update = async (id: string, commentData: ICommentDTO): Promise<IComment | null> => {
  const comment = comments.find((commentId) => commentId.id === id);
  if (!comment) return null;
  const updatedComment = { ...comment, ...commentData };
  updatedComment.updatedAt = new Date();
  return updatedComment;
};

export const deleted = async (id: string): Promise<IComment | undefined> => {
  const commentIndex = comments.findIndex((comment) => comment.id === id);

  if (commentIndex === -1) return undefined;

  const deletedComment = comments[commentIndex];
  comments.splice(commentIndex, 1);

  return deletedComment;
};
