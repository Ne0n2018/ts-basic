// src/services/user.service.ts

import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { IRepository } from 'interfaces/interface';
import { userRepository } from './user.repository';

class UserService {
  private usersRepository: IRepository<User>;

  constructor(usersRepository: IRepository<User>) {
    this.usersRepository = usersRepository;
  }

  // Получить всех пользователей
  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.getAll();
  }

  // Получить пользователя по ID
  async getUserById(id: string): Promise<User | null> {
    if (!id) throw new Error('User ID is required');
    const user = await this.usersRepository.getById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  // Создать пользователя
  async createUser(data: Omit<User, 'Id' | 'CreatedAt' | 'UpdatedAt'>): Promise<User> {
    if (!data.Email || !data.Name || !data.Password) {
      throw new Error('Email, Name, and Password are required');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.Password, salt);

    // Создаём новый объект вместо изменения data
    const userData = {
      ...data,
      Password: hashedPassword,
      Salt: salt,
    };

    return this.usersRepository.create(userData);
  }

  // Обновить пользователя
  async updateUser(
    id: string,
    data: Partial<Omit<User, 'Id' | 'CreatedAt' | 'UpdatedAt'>>
  ): Promise<User> {
    if (!id) throw new Error('User ID is required');
    const user = await this.usersRepository.getById(id);
    if (!user) throw new Error('User not found');

    // Создаём новый объект для обновлённых данных
    let updatedData = { ...data };

    if (data.Password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.Password, salt);
      updatedData = {
        ...updatedData,
        Password: hashedPassword,
        Salt: salt,
      };
    }

    const updatedUser = await this.usersRepository.update(id, updatedData);
    if (!updatedUser) throw new Error('Failed to update user');
    return updatedUser;
  }

  // Удалить пользователя
  async deleteUser(id: string): Promise<void> {
    if (!id) throw new Error('User ID is required');
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) throw new Error('User not found');
  }
}

export const userService = new UserService(userRepository);
