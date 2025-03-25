import { IPrice, IPriceDTO } from '../../interfaces/price.interface';
import * as priceRepository from './price.memory.repository';
import * as scheduleRepository from '../schedule/schedule.memory.repository';

export const getAllPrices = async (): Promise<IPrice[]> => priceRepository.getAll();

export const getPriceById = async (id: string): Promise<IPrice | undefined> => 
  priceRepository.getById(id);

export const getPricesByScheduleId = async (scheduleId: string): Promise<IPrice[]> => 
  priceRepository.getByScheduleId(scheduleId);

export const createPrice = async (priceData: IPriceDTO): Promise<IPrice> => {
  const schedule = await scheduleRepository.getById(priceData.scheduleId);
  if (!schedule) {
    throw new Error('Schedule not found');
  }
  
  return priceRepository.create(priceData);
};

export const updatePrice = async (id: string, priceData: Partial<IPriceDTO>): Promise<IPrice | null> => {
  if (priceData.scheduleId) {
    const schedule = await scheduleRepository.getById(priceData.scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }
  }
  
  return priceRepository.update(id, priceData);
};

export const deletePrice = async (id: string): Promise<boolean> => priceRepository.deleteById(id);

export const deleteByScheduleId = async (scheduleId: string): Promise<boolean> => 
  priceRepository.deleteByScheduleId(scheduleId);
