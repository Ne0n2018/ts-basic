import { Request, Response } from 'express';
import * as tourService from './tour.service';
import * as scheduleService from '../schedule/schedule.service';
import { TourRequestBody, TourRequestParams } from '../../types/express.d';

const handleError = (res: Response, error: Error, status = 500): void => {
  res.status(status).json({ message: error.message });
};

export const getAllTours = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await tourService.getAllTours());
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getTourById = async (
  req: Request<TourRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const tour = await tourService.getTourById(req.params.tourId);
    if (tour) {
      res.json(tour);
    } else {
      res.status(404).json({ message: 'Tour not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getTourSchedules = async (
  req: Request<TourRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const tour = await tourService.getTourById(req.params.tourId);
    if (!tour) {
      res.status(404).json({ message: 'Tour not found' });
      return;
    }
    
    const schedules = await scheduleService.getSchedulesByTourId(req.params.tourId);
    res.json(schedules);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const createTour = async (
  req: Request<void, void, TourRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const newTour = await tourService.createTour(req.body);
    res.status(201).json(newTour);
  } catch (error) {
    handleError(res, error as Error, 400);
  }
};

export const updateTour = async (
  req: Request<TourRequestParams, void, TourRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const updatedTour = await tourService.updateTour(req.params.tourId, req.body);
    if (updatedTour) {
      res.json(updatedTour);
    } else {
      res.status(404).json({ message: 'Tour not found' });
    }
  } catch (error) {
    handleError(res, error as Error, 400);
  }
};

export const deleteTour = async (
  req: Request<TourRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const success = await tourService.deleteTour(req.params.tourId);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: 'Tour not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};
