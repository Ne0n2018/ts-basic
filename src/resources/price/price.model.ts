import { IPrice, IPriceDTO } from '../../interfaces/price.interface';

export class Price implements IPrice {
  id: string;

  scheduleId: string;

  priceValue: number;

  priceCurrency: string;

  createdAt: Date;

  updatedAt: Date;

  constructor({ scheduleId, priceValue, priceCurrency }: IPriceDTO) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.scheduleId = scheduleId;
    this.priceValue = priceValue;
    this.priceCurrency = priceCurrency;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  update(priceData: Partial<IPriceDTO>): void {
    this.priceValue = priceData.priceValue || this.priceValue;
    this.priceCurrency = priceData.priceCurrency || this.priceCurrency;
    this.updatedAt = new Date();
  }
}
