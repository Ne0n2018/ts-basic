import express, { Router } from 'express';
import { body, param, ValidationChain } from 'express-validator';
import * as priceController from './price.controller';
import { asyncHandler } from '../../common/asyncHandler';
import { PriceRequestParams, PriceRequestBody } from '../../types/express.d';

const router: Router = express.Router();

router.get('/', asyncHandler(priceController.getAllPrices));

const createValidation: ValidationChain[] = [
  body('scheduleId').notEmpty().withMessage('Schedule ID is required'),
  body('priceValue').isNumeric().withMessage('Price value should be a number'),
  body('priceCurrency').notEmpty().withMessage('Price currency is required')
];

const updateValidation: ValidationChain[] = [
  param('priceId').isString().notEmpty(),
  body('priceValue').optional().isNumeric(),
  body('priceCurrency').optional().notEmpty()
];

router.post('/', createValidation, asyncHandler<void, void, PriceRequestBody>(priceController.createPrice));
router.get('/:priceId', asyncHandler<PriceRequestParams>(priceController.getPriceById));
router.put('/:priceId', updateValidation, asyncHandler<PriceRequestParams, void, PriceRequestBody>(priceController.updatePrice));
router.delete('/:priceId', asyncHandler<PriceRequestParams>(priceController.deletePrice));

export default router;
