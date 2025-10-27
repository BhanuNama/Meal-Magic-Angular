import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { OrderItem } from '../models/order-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {

  constructor(private apiService: ApiService) {}

  /**
   * Get all order items
   */
  getAllOrderItems(): Observable<OrderItem[]> {
    return this.apiService.get<OrderItem[]>('/order-item/getAllOrderItems');
  }

  /**
   * Get order item by ID
   */
  getOrderItemById(id: string): Observable<OrderItem> {
    return this.apiService.get<OrderItem>(`/order-item/getOrderItemById/${id}`);
  }

  /**
   * Add new order item
   */
  addOrderItem(orderItem: OrderItem): Observable<OrderItem> {
    return this.apiService.post<OrderItem>('/order-item/addOrderItem', orderItem);
  }

  /**
   * Update existing order item
   */
  updateOrderItem(id: string, orderItem: OrderItem): Observable<OrderItem> {
    return this.apiService.put<OrderItem>(`/order-item/updateOrderItem/${id}`, orderItem);
  }

  /**
   * Delete order item
   */
  deleteOrderItem(id: string): Observable<any> {
    return this.apiService.delete<any>(`/order-item/deleteOrderItem/${id}`);
  }
}

