import { User } from '@prisma/client';

export type CreateUserInput = Omit<User, 'Id' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateUserInput = Partial<Omit<User, 'Id' | 'CreatedAt' | 'UpdatedAt'>>;
