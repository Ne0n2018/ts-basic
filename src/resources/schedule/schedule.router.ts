import express, { Router } from 'express';
import { body, param, ValidationChain } from 'express-validator';
import * as scheduleController from './schedule.controller';
import { asyncHandler } from '../../common/asyncHandler';
import { ScheduleRequestParams, ScheduleRequestBody } from '../../types/express.d';

const router: Router = express.Router();

router.get('/', asyncHandler(scheduleController.getAllSchedules));
router.get('/:scheduleId', asyncHandler<ScheduleRequestParams>(scheduleController.getScheduleById));
router.get('/:scheduleId/prices', asyncHandler<ScheduleRequestParams>(scheduleController.getSchedulePrices));

const createValidation: ValidationChain[] = [
  body('tourId').notEmpty().withMessage('Tour ID is required'),
  body('startDate').isISO8601().withMessage('Start date is required and should be a valid ISO 8601 date'),
  body('endDate').isISO8601().withMessage('End date is required and should be a valid ISO 8601 date')
];

const updateValidation: ValidationChain[] = [
  param('scheduleId').isString().notEmpty(),
  body('tourId').optional().notEmpty(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601()
];

router.post('/', createValidation, asyncHandler<void, void, ScheduleRequestBody>(scheduleController.createSchedule));
router.put('/:scheduleId', updateValidation, asyncHandler<ScheduleRequestParams, void, ScheduleRequestBody>(scheduleController.updateSchedule));
router.delete('/:scheduleId', asyncHandler<ScheduleRequestParams>(scheduleController.deleteSchedule));

export default router;
