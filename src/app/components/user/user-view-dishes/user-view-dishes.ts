import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  templateUrl: './user-view-dishes.html',
  styleUrls: ['./user-view-dishes.css']
})
export class UserViewDishesComponent implements OnInit {
  
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  apiUrl = 'http://localhost:3001';
  
  // Reviews modal
  showReviewsModal: boolean = false;
  selectedDish: Dish | null = null;
  dishReviews: Review[] = [];

  constructor(private router: Router, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadDishes();
  }

  async loadDishes() {
    try {
      const response = await fetch(`${this.apiUrl}/dish/getAllDishes`);
      const data = await response.json();
      
      if (response.ok) {
        // Map backend data to component format
        this.dishes = data.map((dish: any) => ({
          id: dish._id,
          name: dish.dishName,
          cuisine: dish.cuisine,
          description: dish.description,
          price: dish.price,
          availability: dish.isAvailable ? 'Available' : 'Not Available',
          image: dish.coverImage
        }));
        this.filteredDishes = [...this.dishes];
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
    }
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
    if (quantity <= 0) {
      this.toastr.warning('Please select a quantity');
      return;
    }

    // Get existing cart from localStorage
    const cartString = localStorage.getItem('cart');
    let cart: any[] = [];
    
    if (cartString) {
      try {
        cart = JSON.parse(cartString);
      } catch (error) {
        console.error('Error parsing cart:', error);
        cart = [];
      }
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.dishId === dish.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        dishId: dish.id,
        dishName: dish.name,
        quantity: quantity
      });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    this.toastr.success(`Added ${quantity} ${dish.name} to cart!`);
  }

  onViewReviews(dish: Dish) {
    this.selectedDish = dish;
    this.loadReviews(dish.id);
    this.showReviewsModal = true;
  }

  async loadReviews(dishId: any) {
    try {
      const response = await fetch(`${this.apiUrl}/review/getReviewsByDishId/${dishId}`);
      const data = await response.json();
      
      if (response.ok && data.data) {
        // Map backend reviews to component format
        this.dishReviews = data.data.map((review: any) => ({
          id: review._id,
          username: review.userId?.username || 'Anonymous',
          rating: review.rating,
          comment: review.reviewText,
          date: new Date(review.createdAt || review.date)
        }));
      } else {
        // No reviews found
        this.dishReviews = [];
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      this.dishReviews = [];
    }
  }

  onWriteReview(dish: Dish) {
    console.log('Write review for:', dish.name);
    // Navigate to review page with dish ID
    this.router.navigate(['/user/review', dish.id]);
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
