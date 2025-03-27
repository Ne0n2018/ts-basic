import { IComment, ICommentDTO } from 'interfaces/comment.interface';
import { v4 as uuidv4 } from 'uuid';

export class Comment implements IComment {
  id: string;

  text: string;

  userId: string;

  postId: string;

  createdAt: Date;

  updatedAt: Date;

  constructor({ text, userId, postId }: ICommentDTO) {
    this.id = uuidv4();
    this.text = text;
    this.userId = userId;
    this.postId = postId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
