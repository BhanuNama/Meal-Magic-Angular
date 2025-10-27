import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private apiService: ApiService) {}

  /**
   * Get all orders
   */
  getAllOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>('/order/getAllOrders');
  }

  /**
   * Get order by ID
   */
  getOrderById(id: string): Observable<Order> {
    return this.apiService.get<Order>(`/order/getOrderById/${id}`);
  }

  /**
   * Add new order
   */
  addOrder(order: Order): Observable<Order> {
    return this.apiService.post<Order>('/order/addOrder', order);
  }

  /**
   * Update existing order
   */
  updateOrder(id: string, order: Order): Observable<Order> {
    return this.apiService.put<Order>(`/order/updateOrder/${id}`, order);
  }

  /**
   * Delete order
   */
  deleteOrder(id: string): Observable<any> {
    return this.apiService.delete<any>(`/order/deleteOrder/${id}`);
  }

  /**
   * Get orders by user ID
   */
  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.apiService.get<Order[]>(`/order/getOrdersByUserId/${userId}`);
  }
}

