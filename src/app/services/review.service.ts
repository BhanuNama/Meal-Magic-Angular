import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private apiService: ApiService) {}

  /**
   * Get all reviews
   */
  getAllReviews(): Observable<Review[]> {
    return this.apiService.get<Review[]>('/review/getAllReviews');
  }

  /**
   * Get review by ID
   */
  getReviewById(id: string): Observable<Review> {
    return this.apiService.get<Review>(`/review/getReviewById/${id}`);
  }

  /**
   * Get reviews by user ID
   */
  getReviewsByUserId(userId: string): Observable<Review[]> {
    return this.apiService.get<Review[]>(`/review/getReviewsByUserId/${userId}`);
  }

  /**
   * Get reviews by dish ID
   */
  getReviewsByDishId(dishId: string): Observable<Review[]> {
    return this.apiService.get<Review[]>(`/review/getReviewsByDishId/${dishId}`);
  }

  /**
   * Add new review
   */
  addReview(review: Review): Observable<Review> {
    return this.apiService.post<Review>('/review/addReview', review);
  }

  /**
   * Update existing review
   */
  updateReview(id: string, review: Review): Observable<Review> {
    return this.apiService.put<Review>(`/review/updateReview/${id}`, review);
  }

  /**
   * Delete review
   */
  deleteReview(id: string): Observable<any> {
    return this.apiService.delete<any>(`/review/deleteReview/${id}`);
  }
}

