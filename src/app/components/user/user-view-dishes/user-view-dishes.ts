import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserNavComponent } from '../user-nav/user-nav';

interface Dish {
  id: number;
  name: string;
  cuisine: string;
  description: string;
  price: number;
  availability: string;
  image: string;
}

interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  date: Date;
}

@Component({
  selector: 'app-user-view-dishes',
  imports: [CommonModule, FormsModule, UserNavComponent],
  templateUrl: './user-view-dishes.html',
  styleUrl: './user-view-dishes.css'
})
export class UserViewDishesComponent implements OnInit {
  
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  
  // Reviews modal
  showReviewsModal: boolean = false;
  selectedDish: Dish | null = null;
  dishReviews: Review[] = [];

  constructor() {}

  ngOnInit() {
    this.loadDishes();
  }

  loadDishes() {
    // Sample data - in real app, this would come from API
    this.dishes = [
      {
        id: 1,
        name: 'Biryani',
        cuisine: 'Indian',
        description: 'Aromatic basmati rice cooked with tender chicken, spices, and herbs',
        price: 250,
        availability: 'Available',
        image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg'
      },
      {
        id: 2,
        name: 'Burger',
        cuisine: 'American',
        description: 'Juicy grilled beef patty with cheese, lettuce, tomato, and sauce in a soft bun',
        price: 180,
        availability: 'Available',
        image: 'https://www.southernliving.com/thmb/x4IHh8b0-bdyHHLzNoHY-SP6E8M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Extra_Easy_Cheeseburger_006-b68cf-35c15b759d9a4e5a80f8a67c41a7a01f.jpg'
      },
      {
        id: 3,
        name: 'Salad',
        cuisine: 'Mediterranean',
        description: 'Fresh mixed greens with cucumber, tomato, olives, and feta cheese',
        price: 150,
        availability: 'Available',
        image: 'https://natashaskitchen.com/wp-content/uploads/2019/01/Caesar-Salad-Recipe-3.jpg'
      },
      {
        id: 4,
        name: 'Sushi',
        cuisine: 'Japanese',
        description: 'Delicate rolls of vinegared rice with fresh fish and vegetables',
        price: 400,
        availability: 'Available',
        image: 'https://www.justonecookbook.com/wp-content/uploads/2020/01/Salmon-Sushi-Roll-0286-I.jpg'
      }
    ];
    
    this.filteredDishes = [...this.dishes];
  }

  onSearch() {
    this.filteredDishes = this.dishes.filter(dish => 
      dish.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  getPaginatedDishes(): Dish[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDishes.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredDishes.length / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onAddToCart(dish: Dish, quantity: number) {
    if (quantity > 0) {
      console.log('Add to cart:', dish.name, 'Qty:', quantity);
      alert(`Added ${quantity} ${dish.name} to cart!`);
    } else {
      alert('Please select a quantity');
    }
  }

  onViewReviews(dish: Dish) {
    this.selectedDish = dish;
    this.loadReviews(dish.id);
    this.showReviewsModal = true;
  }

  loadReviews(dishId: number) {
    // Sample reviews - in real app, fetch from API
    this.dishReviews = [
      {
        id: 1,
        username: 'DemoUser',
        rating: 5,
        comment: 'good',
        date: new Date('2025-10-08')
      },
      {
        id: 2,
        username: 'DemoUser',
        rating: 5,
        comment: 'Worth!',
        date: new Date('2025-10-09')
      },
      {
        id: 3,
        username: 'DemoUser',
        rating: 4,
        comment: 'Tasty!',
        date: new Date('2025-10-10')
      }
    ];
  }

  onWriteReview(dish: Dish) {
    console.log('Write review for:', dish.name);
    alert(`Write Review functionality for ${dish.name} will be implemented`);
    // In real app, navigate to review submission page
  }

  closeReviewsModal() {
    this.showReviewsModal = false;
    this.selectedDish = null;
    this.dishReviews = [];
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}