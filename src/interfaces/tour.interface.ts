export interface ITour {
  id: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITourDTO {
  title: string;
  description?: string;
  isActive?: boolean;
}
