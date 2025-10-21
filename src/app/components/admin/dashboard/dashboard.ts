import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavComponent } from '../admin-nav/admin-nav';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, AdminNavComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
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
        this.users = data.data;
        this.stats.totalUsers = this.users.length;
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
        this.stats.totalOrders = data.data ? data.data.length : 0;
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
        this.stats.totalReviews = data.data ? data.data.length : 0;
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }
}