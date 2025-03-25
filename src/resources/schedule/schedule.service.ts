import { ISchedule, IScheduleDTO } from '../../interfaces/schedule.interface';
import * as scheduleRepository from './schedule.memory.repository';
import * as priceService from '../price/price.service';
import * as tourRepository from '../tour/tour.memory.repository';

export const getAllSchedules = async (): Promise<ISchedule[]> => scheduleRepository.getAll();

export const getScheduleById = async (id: string): Promise<ISchedule | undefined> => 
  scheduleRepository.getById(id);

export const getSchedulesByTourId = async (tourId: string): Promise<ISchedule[]> => 
  scheduleRepository.getByTourId(tourId);

export const createSchedule = async (scheduleData: IScheduleDTO): Promise<ISchedule> => {
  const tour = await tourRepository.getById(scheduleData.tourId);
  if (!tour) {
    throw new Error('Tour not found');
  }
  
  return scheduleRepository.create(scheduleData);
};

export const updateSchedule = async (id: string, scheduleData: Partial<IScheduleDTO>): Promise<ISchedule | null> => {
  if (scheduleData.tourId) {
    const tour = await tourRepository.getById(scheduleData.tourId);
    if (!tour) {
      throw new Error('Tour not found');
    }
  }
  
  return scheduleRepository.update(id, scheduleData);
};

export const deleteSchedule = async (id: string): Promise<boolean> => {
  const result = await scheduleRepository.deleteById(id);
  if (result) {
    await priceService.deleteByScheduleId(id);
  }
  return result;
};

export const deleteByTourId = async (tourId: string): Promise<boolean> => {
  const result = await scheduleRepository.deleteByTourId(tourId);
  
  if (result.success && result.deletedIds.length > 0) {
    const deletePromises = result.deletedIds.map(scheduleId => 
      priceService.deleteByScheduleId(scheduleId)
    );
    await Promise.all(deletePromises);
  }
  
  return result.success;
};
