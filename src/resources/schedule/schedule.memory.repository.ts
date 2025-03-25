import { ISchedule, IScheduleDTO, IScheduleDeletionResult } from '../../interfaces/schedule.interface';
import { Schedule } from './schedule.model';

const schedules: Schedule[] = [];

export const getAll = async (): Promise<ISchedule[]> => [...schedules];

export const getById = async (id: string): Promise<ISchedule | undefined> => 
  schedules.find(s => s.id === id);

export const getByTourId = async (tourId: string): Promise<ISchedule[]> => 
  schedules.filter(s => s.tourId === tourId);

export const create = async (scheduleData: IScheduleDTO): Promise<ISchedule> => {
  const newSchedule = new Schedule(scheduleData);
  schedules.push(newSchedule);
  return newSchedule;
};

export const update = async (id: string, scheduleData: Partial<IScheduleDTO>): Promise<ISchedule | null> => {
  const schedule = schedules.find(s => s.id === id);

  if (!schedule) return null;

  schedule.update(scheduleData);
  return schedule;
};

export const deleteById = async (id: string): Promise<boolean> => {
  const index = schedules.findIndex(s => s.id === id);
  if (index === -1) return false;
  schedules.splice(index, 1);
  return true;
};

export const deleteByTourId = async (tourId: string): Promise<IScheduleDeletionResult> => {
  const initialLength = schedules.length;
  const schedulesToDelete = schedules.filter(s => s.tourId === tourId);
  const idsToDelete = schedulesToDelete.map(s => s.id);

  for (let i = schedules.length - 1; i >= 0; i -= 1) {
    if (schedules[i]!.tourId === tourId) {
      schedules.splice(i, 1);
    }
  }
  
  return {
    success: initialLength > schedules.length,
    deletedIds: idsToDelete
  };
};
