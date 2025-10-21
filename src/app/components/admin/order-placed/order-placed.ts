import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavComponent } from '../admin-nav/admin-nav';

@Component({
  selector: 'app-order-placed',
  imports: [CommonModule, AdminNavComponent],
  template: `
    <app-admin-nav></app-admin-nav>
    <div class="page-placeholder">
      <h2>Order Placed</h2>
      <p>This page is under construction.</p>
    </div>
  `,
  styles: [`
    .page-placeholder {
      padding: 2rem;
      text-align: center;
      background-color: #f8f9fa;
      min-height: 100vh;
    }
    .page-placeholder h2 {
      color: #333;
      margin-bottom: 1rem;
    }
    .page-placeholder p {
      color: #666;
    }
  `]
})
export class OrderPlacedComponent {}