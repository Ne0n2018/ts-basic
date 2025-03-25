import { Request, Response } from 'express';
import * as scheduleService from './schedule.service';
import * as priceService from '../price/price.service';
import { ScheduleRequestBody, ScheduleRequestParams } from '../../types/express.d';

const handleError = (res: Response, error: Error, status = 500): void => {
  res.status(status).json({ message: error.message });
};

export const getAllSchedules = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await scheduleService.getAllSchedules());
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getScheduleById = async (
  req: Request<ScheduleRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.scheduleId);
    if (schedule) {
      res.json(schedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getSchedulePrices = async (
  req: Request<ScheduleRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.scheduleId);
    if (!schedule) {
      res.status(404).json({ message: 'Schedule not found' });
      return;
    }
    
    const prices = await priceService.getPricesByScheduleId(req.params.scheduleId);
    res.json(prices);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const createSchedule = async (
  req: Request<void, void, ScheduleRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const newSchedule = await scheduleService.createSchedule(req.body);
    res.status(201).json(newSchedule);
  } catch (error) {
    handleError(res, error as Error, 400);
  }
};

export const updateSchedule = async (
  req: Request<ScheduleRequestParams, void, ScheduleRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const updatedSchedule = await scheduleService.updateSchedule(req.params.scheduleId, req.body);
    if (updatedSchedule) {
      res.json(updatedSchedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    handleError(res, error as Error, 400);
  }
};

export const deleteSchedule = async (
  req: Request<ScheduleRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const success = await scheduleService.deleteSchedule(req.params.scheduleId);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};