export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  _id?: string;
  orderDate: Date;
  orderStatus: OrderStatus;
  shippingAddress: string;
  billingAddress: string;
  totalAmount: number;
  user: string; // ObjectId reference to User
  orderItems: string[]; // Array of ObjectId references to OrderItem
  createdAt?: Date;
  updatedAt?: Date;
}


