import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements OnInit {
  dishes: any[] = [];
  apiUrl = 'http://localhost:3001';

  constructor(private router: Router, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadDishes();
  }

  async loadDishes() {
    try {
      const response = await fetch(`${this.apiUrl}/dish/getAllDishes`);
      const data = await response.json();
      
      if (response.ok) {
        this.dishes = data.filter((dish: any) => dish.isAvailable);
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  viewDishes(): void {
    // Scroll to dishes section
    const dishesSection = document.querySelector('.py-5.bg-white');
    if (dishesSection) {
      dishesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  viewOrders(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.toastr.warning('Please Login First');
      return;
    }
    // Navigate based on role
    const userData = JSON.parse(user);
    if (userData.role === 'Admin') {
      this.router.navigate(['/admin/orders']);
    } else {
      this.router.navigate(['/user/orders']);
    }
  }

  viewReviews(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.toastr.warning('Please Login First');
      return;
    }
    // Navigate based on role
    const userData = JSON.parse(user);
    if (userData.role === 'Admin') {
      this.router.navigate(['/admin/reviews']);
    } else {
      this.router.navigate(['/user/my-reviews']);
    }
  }

}

