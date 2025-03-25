import { IUser, IUserDTO } from 'interfaces/user.interface';
import { User } from './user.model';

const users: User[] = [];

export const getAll = async (): Promise<IUser[]> => [...users];

export const getById = async (id: string): Promise<IUser | undefined> =>
  users.find((user) => user.id === id);

export const creat = async (userData: IUserDTO): Promise<IUser> => {
  const newUser = new User(userData);
  users.push(newUser);
  return newUser;
};

export const update = async (id: string, userData: IUserDTO): Promise<IUser | null> => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) return null;
  const updatedUser = { ...users[userIndex], ...userData };
  users[userIndex] = updatedUser;

  updatedUser.updatedAt = new Date();

  return updatedUser;
};

export const deleteById = async (id: string): Promise<boolean> => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) return false;

  users.splice(userIndex, 1);
  return true;
};
