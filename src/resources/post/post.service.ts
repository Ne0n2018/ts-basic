import { IPost, IPostDTO } from 'interfaces/post.interface';
import * as postRepo from './post.memory.repository';

export const getAll = async (): Promise<IPost[]> => postRepo.getAll();

export const getById = async (id: string): Promise<IPost | undefined> => postRepo.getById(id);

export const creat = async (postData: IPostDTO): Promise<IPost> => postRepo.creat(postData);

export const update = async (id: string, postData: IPostDTO): Promise<IPost | null> =>
  postRepo.update(id, postData);

export const deleted = async (id: string): Promise<IPost | undefined> => postRepo.deleted(id);
