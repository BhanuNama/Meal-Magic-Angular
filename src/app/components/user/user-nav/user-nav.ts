import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-nav',
  imports: [RouterModule, CommonModule],
  templateUrl: './user-nav.html',
  styleUrl: './user-nav.css'
})
export class UserNavComponent {
  currentUser = this.getCurrentUser();

  constructor(private router: Router) {}

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : { username: 'DemoUser', role: 'User' };
  }

  onLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}