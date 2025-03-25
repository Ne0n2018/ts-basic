import { IComment } from './comment.interface';
import { IPost } from './post.interface';

export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  salt: string;
  posts: IPost[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDTO {
  id: string;
  email: string;
  name: string;
  password: string;
  posts: IPost[];
  comments: IComment[];
}
