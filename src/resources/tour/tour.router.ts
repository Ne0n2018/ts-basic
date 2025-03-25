import express, { Router } from 'express';
import * as tourController from './tour.controller';
import * as validators from './tour.validator';
import { asyncHandler } from '../../common/asyncHandler';
import { TourRequestParams, TourRequestBody } from '../../types/express.d';

const router: Router = express.Router();

router.get('/', asyncHandler(tourController.getAllTours));
router.post('/', validators.createValidator, asyncHandler<void, void, TourRequestBody>(tourController.createTour));
router.get('/:tourId', asyncHandler<TourRequestParams>(tourController.getTourById));
router.get('/:tourId/schedules', asyncHandler<TourRequestParams>(tourController.getTourSchedules));
router.put('/:tourId', validators.updateValidator, asyncHandler<TourRequestParams, void, TourRequestBody>(tourController.updateTour));
router.delete('/:tourId', asyncHandler<TourRequestParams>(tourController.deleteTour));

export default router;
