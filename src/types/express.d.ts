import { ICommentDTO } from 'interfaces/comment.interface';
import { IPostDTO } from 'interfaces/post.interface';
import { IUserDTO } from 'interfaces/user.interface';

export type UserRequestBody = IUserDTO;
export type PostRequestBody = IPostDTO;
export type CommentRequestBody = ICommentDTO;

export interface UserRequestParams {
  userId: string;
}

export interface PostRequestParams {
  postId: string;
}

export interface CommentRequestParams {
  commentId: string;
}
