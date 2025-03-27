import { IComment } from 'interfaces/comment.interface';
import { IPost, IPostDTO } from 'interfaces/post.interface';
import { v4 as uuidv4 } from 'uuid';

export class Post implements IPost {
  id: string;

  userId: string;

  title: string;

  text: string;

  comments: IComment[];

  createdAt: Date;

  updatedAt: Date;

  constructor({ title, text, userId, comments }: IPostDTO) {
    this.id = uuidv4();

    this.userId = userId;
    this.title = title;
    this.text = text;
    this.comments = comments;

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
