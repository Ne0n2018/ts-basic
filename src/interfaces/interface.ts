export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, 'Id' | 'CreatedAt' | 'UpdatedAt'>): Promise<T>;
  update(id: string, data: Partial<Omit<T, 'Id' | 'CreatedAt' | 'UpdatedAt'>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
