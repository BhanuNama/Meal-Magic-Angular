import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavComponent } from '../admin-nav/admin-nav';

interface Review {
  id: number;
  dishName: string;
  rating: number;
  reviewText: string;
  date: Date;
  username: string;
  userId: number;
  dishId: number;
}

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  cuisine: string;
  image: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  joinDate: Date;
}

@Component({
  selector: 'app-admin-view-reviews',
  imports: [CommonModule, FormsModule, AdminNavComponent, DatePipe],
  templateUrl: './admin-view-reviews.html',
  styleUrl: './admin-view-reviews.css'
})
export class AdminViewReviewsComponent implements OnInit {
  
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  searchTerm: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  
  // Modal states
  showDishModal: boolean = false;
  showUserModal: boolean = false;
  selectedDish: Dish | null = null;
  selectedUser: User | null = null;

  constructor() {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    // Sample data - in real app, this would come from API
    this.reviews = [
      {
        id: 1,
        dishName: 'Biryani',
        rating: 5,
        reviewText: 'good',
        date: new Date('2025-10-08'),
        username: 'DemoUser',
        userId: 1,
        dishId: 1
      },
      {
        id: 2,
        dishName: 'Pizza',
        rating: 4,
        reviewText: 'Delicious pizza with great toppings',
        date: new Date('2025-10-07'),
        username: 'FoodLover',
        userId: 2,
        dishId: 2
      },
      {
        id: 3,
        dishName: 'Pasta',
        rating: 3,
        reviewText: 'Average taste, could be better',
        date: new Date('2025-10-06'),
        username: 'DemoUser',
        userId: 1,
        dishId: 3
      },
      {
        id: 4,
        dishName: 'Burger',
        rating: 5,
        reviewText: 'Amazing burger! Highly recommended',
        date: new Date('2025-10-05'),
        username: 'BurgerFan',
        userId: 3,
        dishId: 4
      },
      {
        id: 5,
        dishName: 'Salad',
        rating: 4,
        reviewText: 'Fresh and healthy',
        date: new Date('2025-10-04'),
        username: 'HealthNut',
        userId: 4,
        dishId: 5
      }
    ];
    
    this.filteredReviews = [...this.reviews];
    this.sortReviews();
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

  viewDish(dishId: number) {
    // Sample dish data - in real app, fetch from API
    const dishes: Dish[] = [
      {
        id: 1,
        name: 'Biryani',
        description: 'Aromatic basmati rice cooked with tender chicken, spices, and herbs.',
        price: 250,
        cuisine: 'Indian',
        image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg'
      },
      {
        id: 2,
        name: 'Pizza',
        description: 'Fresh dough topped with mozzarella cheese and premium ingredients',
        price: 12.99,
        cuisine: 'Italian',
        image: 'https://via.placeholder.com/300x200?text=Pizza'
      },
      {
        id: 3,
        name: 'Pasta',
        description: 'Al dente pasta with rich tomato sauce and herbs',
        price: 11.99,
        cuisine: 'Italian',
        image: 'https://via.placeholder.com/300x200?text=Pasta'
      },
      {
        id: 4,
        name: 'Burger',
        description: 'Juicy beef patty with fresh vegetables and special sauce',
        price: 9.99,
        cuisine: 'Fast Food',
        image: 'https://via.placeholder.com/300x200?text=Burger'
      },
      {
        id: 5,
        name: 'Salad',
        description: 'Fresh mixed greens with seasonal vegetables and dressing',
        price: 8.99,
        cuisine: 'Healthy',
        image: 'https://via.placeholder.com/300x200?text=Salad'
      }
    ];
    
    this.selectedDish = dishes.find(dish => dish.id === dishId) || null;
    this.showDishModal = true;
  }

  viewUser(userId: number) {
    // Sample user data - in real app, fetch from API
    const users: User[] = [
      {
        id: 1,
        username: 'DemoUser',
        email: 'demouser@gmail.com',
        phone: '9988998899',
        joinDate: new Date('2025-01-15')
      },
      {
        id: 2,
        username: 'FoodLover',
        email: 'foodlover@email.com',
        phone: '9876543210',
        joinDate: new Date('2025-02-20')
      },
      {
        id: 3,
        username: 'BurgerFan',
        email: 'burgerfan@email.com',
        phone: '9123456789',
        joinDate: new Date('2025-03-10')
      },
      {
        id: 4,
        username: 'HealthNut',
        email: 'healthnut@email.com',
        phone: '9234567890',
        joinDate: new Date('2025-04-05')
      }
    ];
    
    this.selectedUser = users.find(user => user.id === userId) || null;
    this.showUserModal = true;
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