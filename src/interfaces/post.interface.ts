import { IComment } from './comment.interface';

export interface IPost {
  id: string;
  userId: string;
  title: string;
  text: string;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostDTO {
  id: string;
  userId: string;
  title: string;
  text: string;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}
