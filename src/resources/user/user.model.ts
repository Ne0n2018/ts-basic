import { IComment } from 'interfaces/comment.interface';
import { IPost } from 'interfaces/post.interface';
import { IUser, IUserDTO } from 'interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

export class User implements IUser {
  id: string;

  name: string;

  email: string;

  password: string;

  createdAt: Date;

  updatedAt: Date;

  salt: string;

  posts: IPost[];

  comments: IComment[];

  constructor({ name, email, password, salt, posts, comments }: IUserDTO) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.password = password;
    this.salt = salt;
    this.posts = posts;
    this.comments = comments;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
