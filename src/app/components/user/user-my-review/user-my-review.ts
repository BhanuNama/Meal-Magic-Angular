import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNavComponent } from '../user-nav/user-nav';
import { ReviewService } from '../../../services/review.service';
import { DishService } from '../../../services/dish.service';

interface ReviewDisplay {
  _id: string;
  dishName: string;
  dishId: string;
  rating: number;
  reviewText: string;
  date: Date;
}

interface DishDetails {
  _id: string;
  dishName: string;
  description: string;
  price: number;
  cuisine: string;
  coverImage: string;
}

@Component({
  standalone: true,
  selector: 'app-user-my-review',
  imports: [CommonModule, UserNavComponent],
  templateUrl: './user-my-review.html',
  styleUrls: ['./user-my-review.css']
})
export class UserMyReview implements OnInit {
  reviews: ReviewDisplay[] = [];
  userId: string = '';
  
  // Modal states
  showDishModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedDish: DishDetails | null = null;
  reviewToDelete: ReviewDisplay | null = null;

  constructor(
    private reviewService: ReviewService,
    private dishService: DishService
  ) {}

  ngOnInit(): void {
    // Get user ID from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.userId = user.userId || user.id || user._id || '';
        console.log('User ID for reviews:', this.userId);
        this.loadUserReviews();
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  loadUserReviews(): void {
    if (!this.userId) {
      console.error('User ID not found');
      return;
    }

    this.reviewService.getReviewsByUserId(this.userId).subscribe({
      next: (response: any) => {
        console.log('Reviews loaded:', response);
        
        // Handle response format
        const reviewsData = response.data || response;
        
        if (Array.isArray(reviewsData)) {
          this.reviews = reviewsData.map((review: any) => ({
            _id: review._id,
            dishName: review.dish?.dishName || review.dishId?.dishName || 'Unknown Dish',
            dishId: review.dish?._id || review.dishId?._id || review.dish,
            rating: review.rating,
            reviewText: review.reviewText || '',
            date: new Date(review.date || review.createdAt)
          }));
        } else {
          this.reviews = [];
        }
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.reviews = [];
      }
    });
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  viewDish(dishId: string): void {
    this.dishService.getDishById(dishId).subscribe({
      next: (dish: any) => {
        this.selectedDish = {
          _id: dish._id,
          dishName: dish.dishName,
          description: dish.description,
          price: dish.price,
          cuisine: dish.cuisine,
          coverImage: dish.coverImage
        };
        this.showDishModal = true;
      },
      error: (error) => {
        console.error('Error loading dish:', error);
        alert('Failed to load dish details');
      }
    });
  }

  closeDishModal(): void {
    this.showDishModal = false;
    this.selectedDish = null;
  }

  openDeleteModal(review: ReviewDisplay): void {
    this.reviewToDelete = review;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.reviewToDelete = null;
  }

  confirmDelete(): void {
    if (!this.reviewToDelete) {
      return;
    }

    const reviewId = this.reviewToDelete._id;
    const dishName = this.reviewToDelete.dishName;

    this.reviewService.deleteReview(reviewId).subscribe({
      next: (response) => {
        console.log('Review deleted:', response);
        
        // Remove from local array
        this.reviews = this.reviews.filter(r => r._id !== reviewId);
        
        alert(`Review for "${dishName}" has been deleted successfully`);
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
        this.closeDeleteModal();
      }
    });
  }
}

