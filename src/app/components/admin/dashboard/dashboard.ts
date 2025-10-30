import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  
  stats = {
    totalUsers: 0,
    totalDishes: 0,
    totalOrders: 0,
    totalReviews: 0
  };

  users: any[] = [];
  apiUrl = 'http://localhost:3001';

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    await Promise.all([
      this.loadUsers(),
      this.loadDishes(),
      this.loadOrders(),
      this.loadReviews()
    ]);
  }

  async loadUsers() {
    try {
      const response = await fetch(`${this.apiUrl}/user/getAllUsers`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('All users from API:', data.data);
        console.log('User roles:', data.data.map((u: any) => ({ username: u.username, userRole: u.userRole })));
        
        // Filter out admins, only show regular users
        // Check for both 'admin' and 'Admin' (case insensitive)
        this.users = data.data.filter((user: any) => 
          user.userRole?.toLowerCase() !== 'admin'
        );
        this.stats.totalUsers = this.users.length;
        console.log('Filtered users (non-admins):', this.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  async loadDishes() {
    try {
      const response = await fetch(`${this.apiUrl}/dish/getAllDishes`);
      const data = await response.json();
      
      if (response.ok) {
        this.stats.totalDishes = data.length;
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
    }
  }

  async loadOrders() {
    try {
      const response = await fetch(`${this.apiUrl}/order/getAllOrders`);
      const data = await response.json();
      
      if (response.ok) {
        // Handle both data.data and direct array response
        const orders = data.data || data;
        this.stats.totalOrders = Array.isArray(orders) ? orders.length : 0;
        console.log('Total orders:', this.stats.totalOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  async loadReviews() {
    try {
      const response = await fetch(`${this.apiUrl}/review/getAllReviews`);
      const data = await response.json();
      
      if (response.ok) {
        // Handle both data.data and direct array response
        const reviews = data.data || data;
        this.stats.totalReviews = Array.isArray(reviews) ? reviews.length : 0;
        console.log('Total reviews:', this.stats.totalReviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }
}
