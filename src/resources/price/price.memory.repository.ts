import { IPrice, IPriceDTO } from '../../interfaces/price.interface';
import { Price } from './price.model';

const prices: Price[] = [];

export const getAll = async (): Promise<IPrice[]> => [...prices];

export const getById = async (id: string): Promise<IPrice | undefined> => 
  prices.find(p => p.id === id);

export const getByScheduleId = async (scheduleId: string): Promise<IPrice[]> => 
  prices.filter(p => p.scheduleId === scheduleId);

export const create = async (priceData: IPriceDTO): Promise<IPrice> => {
  const newPrice = new Price(priceData);
  prices.push(newPrice);
  return newPrice;
};

export const update = async (id: string, priceData: Partial<IPriceDTO>): Promise<IPrice | null> => {
  const price = prices.find(p => p.id === id);
  if (!price) return null;
  price.update(priceData);
  return price;
};

export const deleteById = async (id: string): Promise<boolean> => {
  const index = prices.findIndex(p => p.id === id);
  if (index === -1) return false;
  prices.splice(index, 1);
  return true;
};

export const deleteByScheduleId = async (scheduleId: string): Promise<boolean> => {
  const initialLength = prices.length;

  for (let i = prices.length - 1; i >= 0; i -= 1) {
    if (prices[i]!.scheduleId === scheduleId) {
      prices.splice(i, 1);
    }
  }
  
  return initialLength > prices.length;
};
