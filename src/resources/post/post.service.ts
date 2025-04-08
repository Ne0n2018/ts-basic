// src/services/post.service.ts

import { Post } from '@prisma/client';
import { IRepository, postRepository } from './post.repository';
import { userService } from '../user/user.service';

class PostService {
  private postRepository: IRepository<Post>;

  constructor(postsRepository: IRepository<Post>) {
    this.postRepository = postsRepository;
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.getAll();
  }

  async getPostById(id: string): Promise<Post | null> {
    if (!id) throw new Error('Post ID is required');
    const post = await this.postRepository.getById(id);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    if (!userId) throw new Error('User ID is required');
    const user = await userService.getUserById(userId);
    if (!user) throw new Error('User not found');
    return this.postRepository.findByField('UserId', userId);
  }

  async createPost(data: Omit<Post, 'Id' | 'CreatedAt' | 'UpdatedAt'>): Promise<Post> {
    if (!data.Title || !data.UserId) {
      throw new Error('Title and UserId are required');
    }

    const user = await userService.getUserById(data.UserId);
    if (!user) {
      throw new Error('User not found');
    }

    const newPost = await this.postRepository.create(data);

    // Обновляем пользователя (Prisma автоматически обновит UpdatedAt)
    await userService.updateUser(data.UserId, {});

    return newPost;
  }

  async updatePost(
    id: string,
    data: Partial<Omit<Post, 'Id' | 'CreatedAt' | 'UpdatedAt'>>
  ): Promise<Post> {
    if (!id) throw new Error('Post ID is required');
    const post = await this.postRepository.getById(id);
    if (!post) throw new Error('Post not found');

    const updatedPost = await this.postRepository.update(id, data);
    if (!updatedPost) throw new Error('Failed to update post');

    // Обновляем пользователя (Prisma автоматически обновит UpdatedAt)
    await userService.updateUser(post.UserId, {});

    return updatedPost;
  }

  async deletePost(id: string): Promise<{ id: string }> {
    if (!id) throw new Error('Post ID is required');
    const post = await this.postRepository.getById(id);
    if (!post) throw new Error('Post not found');

    const deleted = await this.postRepository.delete(id);
    if (!deleted) throw new Error('Failed to delete post');

    // Обновляем пользователя (Prisma автоматически обновит UpdatedAt)
    await userService.updateUser(post.UserId, {});

    return { id };
  }
}

export const postService = new PostService(postRepository);
