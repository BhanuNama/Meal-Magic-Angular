import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavComponent } from '../admin-nav/admin-nav';
import { ReviewService } from '../../../services/review.service';
import { DishService } from '../../../services/dish.service';
import { UserService } from '../../../services/user.service';

interface Review {
  _id: string;
  dishName: string;
  rating: number;
  reviewText: string;
  date: Date;
  username: string;
  userId: string;
  dishId: string;
}

interface Dish {
  _id: string;
  dishName: string;
  description: string;
  price: number;
  cuisine: string;
  coverImage: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  mobileNumber: string;
  createdAt: Date;
}

@Component({
  standalone: true,
  selector: 'app-admin-view-reviews',
  imports: [CommonModule, FormsModule, AdminNavComponent, DatePipe],
  templateUrl: './admin-view-reviews.html',
  styleUrls: ['./admin-view-reviews.css']
})
export class AdminViewReviewsComponent implements OnInit {
  
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  searchTerm: string = '';
  sortOrder: 'asc' | 'desc' = 'desc';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  
  // Modal states
  showDishModal: boolean = false;
  showUserModal: boolean = false;
  selectedDish: Dish | null = null;
  selectedUser: User | null = null;

  constructor(
    private reviewService: ReviewService,
    private dishService: DishService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getAllReviews().subscribe({
      next: (data: any) => {
        console.log('Reviews data:', data);
        const reviewsData = data.data || data;
        
        this.reviews = reviewsData.map((review: any) => ({
          _id: review._id,
          dishName: review.dish?.dishName || 'Unknown Dish',
          rating: review.rating,
          reviewText: review.reviewText,
          date: new Date(review.createdAt),
          username: review.user?.username || 'Unknown User',
          userId: review.user?._id,
          dishId: review.dish?._id
        }));
        
        this.filteredReviews = [...this.reviews];
        this.sortReviews();
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        alert('Failed to load reviews. Please try again.');
      }
    });
  }

  onSearch() {
    this.filteredReviews = this.reviews.filter(review => 
      review.dishName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      review.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.sortReviews();
  }

  onSortChange() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortReviews();
  }

  sortReviews() {
    this.filteredReviews.sort((a, b) => {
      const comparison = a.date.getTime() - b.date.getTime();
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  getPaginatedReviews(): Review[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredReviews.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredReviews.length / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  viewDish(dishId: string) {
    if (!dishId) {
      alert('Dish information not available');
      return;
    }

    this.dishService.getDishById(dishId).subscribe({
      next: (data: any) => {
        console.log('Dish data:', data);
        const dishData = data.data || data;
        
        this.selectedDish = {
          _id: dishData._id,
          dishName: dishData.dishName,
          description: dishData.description,
          price: dishData.price,
          cuisine: dishData.cuisine,
          coverImage: dishData.coverImage
        };
        
        this.showDishModal = true;
      },
      error: (error) => {
        console.error('Error loading dish:', error);
        alert('Failed to load dish details.');
      }
    });
  }

  viewUser(userId: string) {
    if (!userId) {
      alert('User information not available');
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (data: any) => {
        console.log('User data:', data);
        const userData = data.data || data;
        
        this.selectedUser = {
          _id: userData._id,
          username: userData.username,
          email: userData.email,
          mobileNumber: userData.mobileNumber,
          createdAt: new Date(userData.createdAt)
        };
        
        this.showUserModal = true;
      },
      error: (error: any) => {
        console.error('Error loading user:', error);
        alert('Failed to load user details.');
      }
    });
  }

  closeDishModal() {
    this.showDishModal = false;
    this.selectedDish = null;
  }

  closeUserModal() {
    this.showUserModal = false;
    this.selectedUser = null;
  }
}
