import { PrismaClient, User } from '@prisma/client';
import { IRepository } from 'interfaces/interface';

// Класс UserRepository, использующий Prisma
class UserRepository implements IRepository<User> {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Получить все записи
  async getAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        Posts: true,
        Comments: true,
      },
    });
  }

  // Получить запись по ID
  async getById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { Id: id },
      include: {
        Posts: true,
        Comments: true,
      },
    });
  }

  // Создать новую запись
  async create(data: Omit<User, 'Id' | 'CreatedAt' | 'UpdatedAt'>): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        Id: undefined, // Prisma автоматически сгенерирует UUID
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    });
  }

  // Обновить запись по ID
  async update(
    id: string,
    data: Partial<Omit<User, 'Id' | 'CreatedAt' | 'UpdatedAt'>>
  ): Promise<User | null> {
    try {
      return await this.prisma.user.update({
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

  // Удалить запись по ID
  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { Id: id },
      });
      return true;
    } catch (error) {
      // Если запись не найдена, Prisma выбросит ошибку
      return false;
    }
  }
}

// Экспорт экземпляра репозитория
export const userRepository = new UserRepository();
