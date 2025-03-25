import { ITour, ITourDTO } from '../../interfaces/tour.interface';
import * as tourRepository from './tour.memory.repository';
import * as scheduleService from '../schedule/schedule.service';
import { Tour } from './tour.model';

export const getAllTours = async (): Promise<ITour[]> => tourRepository.getAll();

export const getTourById = async (id: string): Promise<ITour | undefined> => tourRepository.getById(id);

export const createTour = async (tourData: ITourDTO): Promise<ITour> => {
  const existingTour = await tourRepository.getBySlug(Tour.createSlug(tourData.title));
  if (existingTour) {
    throw new Error('Slug must be unique');
  }
  return tourRepository.create(tourData);
};

export const updateTour = async (id: string, tourData: Partial<ITourDTO>): Promise<ITour | null> => {
  const allowedFields: Array<keyof ITourDTO> = ['title', 'description', 'isActive'];
  const filteredData = Object.keys(tourData)
    .filter(key => allowedFields.includes(key as keyof ITourDTO))
    .reduce((obj, key) => ({ ...obj, [key]: tourData[key as keyof ITourDTO] }), {} as Partial<ITourDTO>);

  return tourRepository.update(id, filteredData);
};

export const deleteTour = async (id: string): Promise<boolean> => {
  const result = await tourRepository.deleteById(id);
  if (result) await scheduleService.deleteByTourId(id);
  return result;
};
