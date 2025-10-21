export interface OrderItem {
  _id?: string;
  quantity: number;
  price: number;
  dish: string; // ObjectId reference to Dish
  order: string; // ObjectId reference to Order
  createdAt?: Date;
  updatedAt?: Date;
}


