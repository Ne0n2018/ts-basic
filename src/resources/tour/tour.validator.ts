import { body, param, ValidationChain } from 'express-validator';

export const createValidator: ValidationChain[] = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('isActive').optional().isBoolean()
];

export const updateValidator: ValidationChain[] = [
  param('tourId').isString().notEmpty(),
  body('title').optional(),
  body('description').optional(),
  body('isActive').optional().isBoolean()
];
