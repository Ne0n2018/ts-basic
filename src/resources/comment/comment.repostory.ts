import { PrismaClient, Comment } from '@prisma/client';

export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, 'Id' | 'CreatedAt' | 'UpdatedAt'>): Promise<T>;
  update(id: string, data: Partial<Omit<T, 'Id' | 'CreatedAt' | 'UpdatedAt'>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findByField<K extends keyof T>(field: K, value: T[K]): Promise<T[]>;
}

class CommentRepository implements IRepository<Comment> {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll(): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      include: {
        Post: true,
        User: true,
      },
    });
  }

  async getById(id: string): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { Id: id },
      include: {
        Post: true,
        User: true,
      },
    });
  }

  async create(data: Omit<Comment, 'Id' | 'CreatedAt' | 'UpdatedAt'>): Promise<Comment> {
    return this.prisma.comment.create({
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
    data: Partial<Omit<Comment, 'Id' | 'CreatedAt' | 'UpdatedAt'>>
  ): Promise<Comment | null> {
    try {
      return await this.prisma.comment.update({
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
      await this.prisma.comment.delete({
        where: { Id: id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByField<K extends keyof Comment>(field: K, value: Comment[K]): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        [field]: value,
      },
      include: {
        Post: true,
        User: true,
      },
    });
  }
}

export const commentRepository = new CommentRepository();
