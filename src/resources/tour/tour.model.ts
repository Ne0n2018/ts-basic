import { ITour, ITourDTO } from '../../interfaces/tour.interface';

export class Tour implements ITour {
  id: string;

  title: string;

  slug: string;

  description: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

  constructor({ title, description, isActive = true }: ITourDTO) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.title = title;
    this.slug = Tour.createSlug(title);
    this.description = description || '';
    this.isActive = isActive;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static createSlug(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }
}
