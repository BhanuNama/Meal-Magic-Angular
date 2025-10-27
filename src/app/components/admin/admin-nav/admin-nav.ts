import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-nav',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-nav.html',
  styleUrls: ['./admin-nav.css']
})
export class AdminNavComponent implements OnInit {
  currentUser: any = null;
  showLogoutPopup: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.getCurrentUser();
    
    // If no user is logged in, redirect to login
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
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

  openLogoutPopup(): void {
    this.showLogoutPopup = true;
  }

  closeLogoutPopup(): void {
    this.showLogoutPopup = false;
  }

  handleLogout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    this.closeLogoutPopup();
    this.router.navigate(['/login']);
  }
}
