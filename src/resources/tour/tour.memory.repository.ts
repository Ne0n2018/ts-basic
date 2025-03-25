import { ITour, ITourDTO } from '../../interfaces/tour.interface';
import { Tour } from './tour.model';

const tours: Tour[] = [];

export const getAll = async (): Promise<ITour[]> => [...tours];

export const getById = async (id: string): Promise<ITour | undefined> => 
  tours.find(t => t.id === id);

export const getBySlug = async (slug: string): Promise<ITour | undefined> => 
  tours.find(t => t.slug === slug);

export const create = async (tourData: ITourDTO): Promise<ITour> => {
  const newTour = new Tour(tourData);
  tours.push(newTour);
  return newTour;
};

export const update = async (id: string, tourData: Partial<ITourDTO>): Promise<ITour | null> => {
  const index = tours.findIndex(t => t.id === id);
  if (index === -1) return null;

  const tour = tours[index];

  if (!tour) {
    return null
  }

  if (tourData.title !== undefined) {
    tour.title = tourData.title;
    tour.slug = Tour.createSlug(tourData.title);
  }
  
  if (tourData.description !== undefined) {
    tour.description = tourData.description;
  }
  
  if (tourData.isActive !== undefined) {
    tour.isActive = tourData.isActive;
  }
  
  tour.updatedAt = new Date();

  return tour;
};

export const deleteById = async (id: string): Promise<boolean> => {
  const index = tours.findIndex(t => t.id === id);
  if (index === -1) return false;
  tours.splice(index, 1);
  return true;
};
