import { ISchedule, IScheduleDTO } from '../../interfaces/schedule.interface';

export class Schedule implements ISchedule {
  id: string;

  tourId: string;

  isActive: boolean;

  startDate: string;

  endDate: string;

  createdAt: Date;

  updatedAt: Date;

  constructor({ tourId, isActive = true, startDate, endDate }: IScheduleDTO) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.tourId = tourId;
    this.isActive = isActive;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  update(scheduleData: Partial<IScheduleDTO>): void {
    this.tourId = scheduleData.tourId || this.tourId;
    this.isActive = scheduleData.isActive !== undefined ? scheduleData.isActive : this.isActive;
    this.startDate = scheduleData.startDate || this.startDate;
    this.endDate = scheduleData.endDate || this.endDate;
    this.updatedAt = new Date();
  }
}
