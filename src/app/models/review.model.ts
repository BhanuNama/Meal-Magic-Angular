export interface Review {
  _id?: string;
  reviewText?: string;
  rating: number; // 1-5
  date: Date;
  user: string; // ObjectId reference to User
  dish: string; // ObjectId reference to Dish
  createdAt?: Date;
  updatedAt?: Date;
}


