import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-nav',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-nav.html',
  styleUrls: ['./admin-nav.css']
})
export class AdminNavComponent {
  currentUser = this.getCurrentUser();

  constructor(private router: Router) {}

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : { username: 'DemoAdmin', role: 'Admin' };
  }

  onLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  navigateTo(page: string) {
    this.router.navigate([`/admin/${page}`]);
  }
}
