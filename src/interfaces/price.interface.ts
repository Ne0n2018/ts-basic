export interface IPrice {
  id: string;
  scheduleId: string;
  priceValue: number;
  priceCurrency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPriceDTO {
  scheduleId: string;
  priceValue: number;
  priceCurrency: string;
}
