// src/repositories/post.repository.ts

import { PrismaClient, Post } from '@prisma/client';

export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, 'Id' | 'CreatedAt' | 'UpdatedAt'>): Promise<T>;
  update(id: string, data: Partial<Omit<T, 'Id' | 'CreatedAt' | 'UpdatedAt'>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findByField(field: keyof T, value: string): Promise<T[]>;
}

class PostRepository implements IRepository<Post> {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: {
        User: true,
        Comments: true,
      },
    });
  }

  async getById(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { Id: id },
      include: {
        User: true,
        Comments: true,
      },
    });
  }

  async create(data: Omit<Post, 'Id' | 'CreatedAt' | 'UpdatedAt'>): Promise<Post> {
    return this.prisma.post.create({
      data: {
        ...data,
        Id: undefined, // Prisma автоматически сгенерирует UUID
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Post, 'Id' | 'CreatedAt' | 'UpdatedAt'>>
  ): Promise<Post | null> {
    try {
      return await this.prisma.post.update({
        where: { Id: id },
        data: {
          ...data,
          UpdatedAt: new Date(),
        },
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.post.delete({
        where: { Id: id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByField(field: keyof Post, value: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        [field]: value,
      },
      include: {
        User: true,
        Comments: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Post[]> {
    return this.findByField('UserId', userId);
  }
}

export const postRepository = new PostRepository();
