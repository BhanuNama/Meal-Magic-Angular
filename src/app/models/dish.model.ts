export interface Dish {
  _id?: string;
  dishName: string;
  description: string;
  cuisine: string;
  price: number;
  isAvailable: boolean;
  coverImage: string;
  createdAt?: Date;
  updatedAt?: Date;
}


