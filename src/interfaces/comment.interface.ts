export interface IComment {
  id: string;
  text: string;
  userId: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentDTO {
  id: string;
  text: string;
  userId: string;
  postId: string;
}
