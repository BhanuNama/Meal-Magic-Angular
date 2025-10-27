import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface CartItem {
  dishId: string;
  dishName: string;
  quantity: number;
}

@Component({
  standalone: true,
  selector: 'app-user-nav',
  imports: [RouterModule, CommonModule],
  templateUrl: './user-nav.html',
  styleUrls: ['./user-nav.css']
})
export class UserNavComponent implements OnInit {
  currentUser: any = null;
  showLogoutPopup: boolean = false;
  showCartOverlay: boolean = false;
  cartItems: CartItem[] = [];
  cartItemCount: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.getCurrentUser();
    
    // If no user is logged in, redirect to login
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadCart();
    
    // Listen for cart updates (works across tabs)
    window.addEventListener('storage', (event) => {
      if (event.key === 'cart') {
        this.loadCart();
      }
    });

    // Listen for custom cart update event (works in same tab)
    window.addEventListener('cartUpdated', () => {
      this.loadCart();
    });
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  loadCart(): void {
    const cartString = localStorage.getItem('cart');
    if (cartString) {
      try {
        this.cartItems = JSON.parse(cartString);
        this.cartItemCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      } catch (error) {
        console.error('Error parsing cart:', error);
        this.cartItems = [];
        this.cartItemCount = 0;
      }
    } else {
      this.cartItems = [];
      this.cartItemCount = 0;
    }
  }

  toggleCartOverlay(): void {
    this.showCartOverlay = !this.showCartOverlay;
    if (this.showCartOverlay) {
      this.loadCart();
    }
  }

  closeCartOverlay(): void {
    this.showCartOverlay = false;
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear the cart?')) {
      localStorage.removeItem('cart');
      this.loadCart();
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  }

  goToCheckout(): void {
    this.closeCartOverlay();
    this.router.navigate(['/user/checkout']);
  }

  openLogoutPopup(): void {
    this.showLogoutPopup = true;
  }

  closeLogoutPopup(): void {
    this.showLogoutPopup = false;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    this.closeLogoutPopup();
    this.router.navigate(['/login']);
  }
}
