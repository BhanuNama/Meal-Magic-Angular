import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserNavComponent } from '../user-nav/user-nav';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review.model';

@Component({
  standalone: true,
  selector: 'app-user-review',
  imports: [CommonModule, FormsModule, UserNavComponent],
  templateUrl: './user-review.html',
  styleUrls: ['./user-review.css']
})
export class UserReview implements OnInit {
  reviewText: string = '';
  rating: number = 0;
  dishId: string = '';
  userId: string = '';
  
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  // Star emojis for rating
  starEmojis = ['😡', '😞', '😐', '😊', '🤩'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    // Get dish ID from route params
    this.dishId = this.route.snapshot.paramMap.get('dishId') || '';
    
    // Get user ID from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.userId = user.userId || user.id || user._id || '';
        console.log('User ID from localStorage:', this.userId);
        console.log('Full user object:', user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.error('No user data found in localStorage');
    }
    
    console.log('Dish ID:', this.dishId);
  }

  selectRating(index: number): void {
    this.rating = index + 1;
  }

  async onSubmit(): Promise<void> {
    // Validation
    if (!this.reviewText.trim()) {
      this.displayToast('Please write a review', 'error');
      return;
    }

    if (this.rating === 0) {
      this.displayToast('Please select a rating', 'error');
      return;
    }

    if (!this.userId) {
      this.displayToast('User not logged in', 'error');
      return;
    }

    if (!this.dishId) {
      this.displayToast('Dish not found', 'error');
      return;
    }

    const newReview: Review = {
      reviewText: this.reviewText.trim(),
      rating: this.rating,
      date: new Date(),
      user: this.userId,
      dish: this.dishId
    };

    this.reviewService.addReview(newReview).subscribe({
      next: (response) => {
        console.log('Review submitted successfully:', response);
        this.displayToast('Review submitted successfully!', 'success');
        
        // Reset form
        this.reviewText = '';
        this.rating = 0;
        
        // Navigate back after delay
        setTimeout(() => {
          this.router.navigate(['/user/my-reviews']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.displayToast('Failed to submit review. Please try again.', 'error');
      }
    });
  }

  displayToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}

