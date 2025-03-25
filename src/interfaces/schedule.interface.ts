export interface ISchedule {
  id: string;
  tourId: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IScheduleDTO {
  tourId: string;
  isActive?: boolean;
  startDate: string;
  endDate: string;
}

export interface IScheduleDeletionResult {
  success: boolean;
  deletedIds: string[];
}
