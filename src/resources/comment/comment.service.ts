// src/services/comment.service.ts

import { Comment } from '@prisma/client';
import { commentRepository, IRepository } from './comment.repostory';
import { postService } from '../post/post.service';
import { userService } from '../user/user.service';

class CommentService {
  private commentRepository: IRepository<Comment>;

  constructor(commentsRepository: IRepository<Comment>) {
    this.commentRepository = commentsRepository;
  }

  async getAllComments(): Promise<Comment[]> {
    return this.commentRepository.getAll();
  }

  async getCommentById(id: string): Promise<Comment | null> {
    if (!id) throw new Error('Comment ID is required');
    const comment = await this.commentRepository.getById(id);
    if (!comment) throw new Error('Comment not found');
    return comment;
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    if (!postId) throw new Error('Post ID is required');
    const post = await postService.getPostById(postId);
    if (!post) throw new Error('Post not found');
    return this.commentRepository.findByField('PostId', postId);
  }

  async getCommentsByUserId(userId: string): Promise<Comment[]> {
    if (!userId) throw new Error('User ID is required');
    const user = await userService.getUserById(userId);
    if (!user) throw new Error('User not found');
    return this.commentRepository.findByField('UserId', userId);
  }

  async createComment(data: Omit<Comment, 'Id' | 'CreatedAt' | 'UpdatedAt'>): Promise<Comment> {
    if (!data.Text || !data.PostId || !data.UserId) {
      throw new Error('Text, PostId, and UserId are required');
    }

    const post = await postService.getPostById(data.PostId);
    if (!post) throw new Error('Post not found');

    const user = await userService.getUserById(data.UserId);
    if (!user) throw new Error('User not found');

    const newComment = await this.commentRepository.create(data);

    // Обновляем пользователя и пост (Prisma автоматически обновит UpdatedAt)
    await userService.updateUser(data.UserId, {});
    await postService.updatePost(data.PostId, {});

    return newComment;
  }

  async updateComment(
    id: string,
    data: Partial<Omit<Comment, 'Id' | 'CreatedAt' | 'UpdatedAt'>>
  ): Promise<Comment> {
    if (!id) throw new Error('Comment ID is required');
    const comment = await this.commentRepository.getById(id);
    if (!comment) throw new Error('Comment not found');

    const updatedComment = await this.commentRepository.update(id, data);
    if (!updatedComment) throw new Error('Failed to update comment');

    // Обновляем пользователя и пост (Prisma автоматически обновит UpdatedAt)
    await userService.updateUser(comment.UserId, {});
    await postService.updatePost(comment.PostId, {});

    return updatedComment;
  }

  async deleteComment(id: string): Promise<{ id: string }> {
    if (!id) throw new Error('Comment ID is required');
    const comment = await this.commentRepository.getById(id);
    if (!comment) throw new Error('Comment not found');

    const deleted = await this.commentRepository.delete(id);
    if (!deleted) throw new Error('Failed to delete comment');

    // Обновляем пользователя и пост (Prisma автоматически обновит UpdatedAt)
    await userService.updateUser(comment.UserId, {});
    await postService.updatePost(comment.PostId, {});

    return { id };
  }
}

export const commentService = new CommentService(commentRepository);
