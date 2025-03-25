import { Request, Response } from 'express';
import * as priceService from './price.service';
import { PriceRequestBody, PriceRequestParams } from '../../types/express.d';

const handleError = (res: Response, error: Error, status = 500): void => {
  res.status(status).json({ message: error.message });
};

export const getAllPrices = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await priceService.getAllPrices());
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getPriceById = async (
  req: Request<PriceRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const price = await priceService.getPriceById(req.params.priceId);
    if (price) {
      res.json(price);
    } else {
      res.status(404).json({ message: 'Price not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const createPrice = async (
  req: Request<void, void, PriceRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const newPrice = await priceService.createPrice(req.body);
    res.status(201).json(newPrice);
  } catch (error) {
    handleError(res, error as Error, 400);
  }
};

export const updatePrice = async (
  req: Request<PriceRequestParams, void, PriceRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const updatedPrice = await priceService.updatePrice(req.params.priceId, req.body);
    if (updatedPrice) {
      res.json(updatedPrice);
    } else {
      res.status(404).json({ message: 'Price not found' });
    }
  } catch (error) {
    handleError(res, error as Error, 400);
  }
};

export const deletePrice = async (
  req: Request<PriceRequestParams, void, void>,
  res: Response
): Promise<void> => {
  try {
    const success = await priceService.deletePrice(req.params.priceId);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: 'Price not found' });
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};