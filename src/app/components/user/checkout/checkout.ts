import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { DishService } from '../../../services/dish.service';

interface CartItem {
  dishId: string;
  dishName: string;
  quantity: number;
  price?: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  shippingAddress: string = '';
  billingAddress: string = '';

  constructor(
    private router: Router,
    private orderService: OrderService,
    private dishService: DishService
  ) {}

  ngOnInit(): void {
    this.loadCartWithPrices();
  }

  loadCartWithPrices(): void {
    const cartString = localStorage.getItem('cart');
    if (!cartString) {
      this.cartItems = [];
      this.totalAmount = 0;
      return;
    }

    try {
      const cart = JSON.parse(cartString);
      
      // Fetch all dishes to get prices
      this.dishService.getAllDishes().subscribe({
        next: (response: any) => {
          const dishes = Array.isArray(response) ? response : (response.data || []);

          // Map cart items with prices
          this.cartItems = cart.map((item: CartItem) => {
            const dish = dishes.find((d: any) => d._id === item.dishId);
            return {
              ...item,
              price: dish ? dish.price : 0
            };
          });

          // Calculate total
          this.totalAmount = this.cartItems.reduce((sum, item) => {
            return sum + (item.price || 0) * item.quantity;
          }, 0);
        },
        error: (error) => {
          console.error('Error loading dishes for cart:', error);
          this.cartItems = [];
          this.totalAmount = 0;
        }
      });
    } catch (error) {
      console.error('Error parsing cart:', error);
      this.cartItems = [];
      this.totalAmount = 0;
    }
  }

  onPlaceOrder(): void {
    // Validate inputs
    if (!this.shippingAddress.trim()) {
      alert('Please enter shipping address');
      return;
    }

    if (!this.billingAddress.trim()) {
      alert('Please enter billing address');
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Get user from localStorage
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert('Please login to place order');
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = JSON.parse(userString);
      const userId = user.userId || user.id || user._id;

      if (!userId) {
        alert('User ID not found. Please login again.');
        this.router.navigate(['/login']);
        return;
      }

      // Prepare order data according to backend structure
      const orderData = {
        user: userId,
        orderItems: this.cartItems.map(item => ({
          dish: item.dishId,
          quantity: item.quantity
        })),
        shippingAddress: this.shippingAddress,
        billingAddress: this.billingAddress
      };

      console.log('Placing order:', orderData);

      // Call order API
      this.orderService.addOrder(orderData as any).subscribe({
        next: (response) => {
          console.log('Order placed successfully:', response);
          alert('Order placed successfully!');
          
          // Clear cart
          localStorage.removeItem('cart');
          window.dispatchEvent(new CustomEvent('cartUpdated'));
          
          // Redirect to orders page
          this.router.navigate(['/user/orders']);
        },
        error: (error) => {
          console.error('Error placing order:', error);
          alert('Failed to place order. Please try again.');
        }
      });

    } catch (error) {
      console.error('Error processing order:', error);
      alert('Failed to place order. Please try again.');
    }
  }
}
