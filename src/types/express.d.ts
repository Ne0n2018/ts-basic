import { ITourDTO } from '../interfaces/tour.interface';
import { IScheduleDTO } from '../interfaces/schedule.interface';
import { IPriceDTO } from '../interfaces/price.interface';

export type TourRequestBody = ITourDTO;
export type ScheduleRequestBody = IScheduleDTO;
export type PriceRequestBody = IPriceDTO;

export interface TourRequestParams {
  tourId: string;
}

export interface ScheduleRequestParams {
  scheduleId: string;
}

export interface PriceRequestParams {
  priceId: string;
}
