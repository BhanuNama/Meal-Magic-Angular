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
    totalUsers: 1,
    totalDishes: 4,
    totalOrders: 0,
    totalReviews: 0
  };

  users = [
    {
      username: 'DemoUser',
      email: 'demouser@gmail.com',
      mobileNumber: '9988998899'
    }
  ];

  ngOnInit() {
    // Component initialization
  }
}