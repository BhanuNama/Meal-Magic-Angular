import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Dish } from '../models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private apiService: ApiService) {}

  /**
   * Get all dishes
   */
  getAllDishes(): Observable<Dish[]> {
    return this.apiService.get<Dish[]>('/dish/getAllDishes');
  }

  /**
   * Get dish by ID
   */
  getDishById(id: string): Observable<Dish> {
    return this.apiService.get<Dish>(`/dish/getDishById/${id}`);
  }

  /**
   * Add new dish
   */
  addDish(dish: Dish): Observable<Dish> {
    return this.apiService.post<Dish>('/dish/addDish', dish);
  }

  /**
   * Update existing dish
   */
  updateDish(id: string, dish: Dish): Observable<Dish> {
    return this.apiService.put<Dish>(`/dish/updateDish/${id}`, dish);
  }

  /**
   * Delete dish
   */
  deleteDish(id: string): Observable<any> {
    return this.apiService.delete<any>(`/dish/deleteDish/${id}`);
  }
}

