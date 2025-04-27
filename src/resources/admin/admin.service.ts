import { PrismaClient, Admin } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const adminService = {
  // Создание нового администратора
  async createAdmin(adminData: { Name: string; Password: string }): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(adminData.Password, 10);
    return prisma.admin.create({
      data: {
        Name: adminData.Name,
        Password: hashedPassword,
      },
    });
  },

  // Поиск администратора по имени
  async getAdminByName(name: string): Promise<Admin | null> {
    return prisma.admin.findFirst({
      where: { Name: name },
    });
  },

  // Проверка пароля
  async verifyPassword(admin: Admin, password: string): Promise<boolean> {
    return bcrypt.compare(password, admin.Password);
  },

  // Генерация JWT-токена
  async generateToken(admin: Admin): Promise<string> {
    const secret = process.env['JWT_SECRET'] || 'your_jwt_secret';
    return jwt.sign({ id: admin.Id, name: admin.Name, role: 'admin' }, secret, {
      expiresIn: '1h',
    });
  },

  // Сохранение токена в базе (для возможности logout)
  async saveToken(adminId: string, token: string): Promise<void> {
    await prisma.token.create({
      data: {
        Token: token,
        AdminId: adminId,
      },
    });
  },

  // Проверка, существует ли токен (для blacklist)
  async tokenExists(token: string): Promise<boolean> {
    const tokenRecord = await prisma.token.findUnique({
      where: { Token: token },
    });
    return !!tokenRecord;
  },

  // Удаление токена (logout)
  async deleteToken(token: string): Promise<void> {
    await prisma.token.delete({
      where: { Token: token },
    });
  },
};
