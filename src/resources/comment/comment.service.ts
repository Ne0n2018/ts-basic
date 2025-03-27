import { IComment, ICommentDTO } from 'interfaces/comment.interface';
import * as commentRepo from './comment.memory.repository';

export const getAll = async (): Promise<IComment[]> => commentRepo.getAll();
export const getById = async (id: string): Promise<IComment | undefined> => commentRepo.getById(id);

export const creat = async (commentData: ICommentDTO): Promise<IComment> =>
  commentRepo.creat(commentData);

export const update = async (id: string, commentData: ICommentDTO): Promise<IComment | null> =>
  commentRepo.update(id, commentData);

export const deleted = async (id: string): Promise<IComment | undefined> => commentRepo.deleted(id);
