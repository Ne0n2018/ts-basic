import { IUser, IUserDTO } from 'interfaces/user.interface';
import * as userRepo from './user.memory.repository';

export const getAll = async (): Promise<IUser[]> => userRepo.getAll();

export const getById = async (id: string): Promise<IUser | undefined> => userRepo.getById(id);

export const create = async (userData: IUserDTO): Promise<IUser> => userRepo.creat(userData);

export const update = async (id: string, userData: IUserDTO): Promise<IUser | null> =>
  userRepo.update(id, userData);

export const deleteById = async (id: string): Promise<boolean> => userRepo.deleteById(id);
