import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavComponent } from '../admin-nav/admin-nav';
import { OrderService } from '../../../services/order.service';

interface OrderItem {
  dish: any;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: any;
  orderItems: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  shippingAddress: string;
  billingAddress: string;
  createdAt: Date;
}

interface OrderDisplay {
  _id: string;
  orderId: string;
  username: string;
  email: string;
  mobile: string;
  items: Array<{
    dishName: string;
    quantity: number;
    price: number;
    coverImage: string;
    cuisine: string;
  }>;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  billingAddress: string;
  orderDate: Date;
}

@Component({
  standalone: true,
  selector: 'app-order-placed',
  imports: [CommonModule, FormsModule, AdminNavComponent],
  templateUrl: './order-placed.html',
  styleUrls: ['./order-placed.css']
})
export class OrderPlacedComponent implements OnInit {
  orders: OrderDisplay[] = [];
  filteredOrders: OrderDisplay[] = [];
  paginatedOrders: OrderDisplay[] = [];
  
  searchTerm: string = '';
  sortOrder: string = 'ascending';
  currentPage: number = 1;
  ordersPerPage: number = 5;
  
  // Modals
  showItemsModal: boolean = false;
  showProfileModal: boolean = false;
  selectedOrder: OrderDisplay | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        console.log('Orders loaded:', response);
        const ordersData = Array.isArray(response) ? response : (response.data || []);
        
        this.orders = ordersData.map((order: Order) => ({
          _id: order._id,
          orderId: order._id,
          username: order.user?.username || 'Unknown',
          email: order.user?.email || 'N/A',
          mobile: order.user?.mobileNumber || 'N/A',
          items: order.orderItems?.map((item: any) => ({
            dishName: item.dish?.dishName || 'Unknown Dish',
            quantity: item.quantity,
            price: item.price,
            coverImage: item.dish?.coverImage || 'https://via.placeholder.com/100',
            cuisine: item.dish?.cuisine || 'N/A'
          })) || [],
          totalAmount: order.totalAmount,
          status: order.orderStatus,
          shippingAddress: order.shippingAddress || 'N/A',
          billingAddress: order.billingAddress || 'N/A',
          orderDate: new Date(order.createdAt)
        }));
        
        this.filteredOrders = [...this.orders];
        this.applyFiltersAndSort();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        alert('Failed to load orders. Please try again.');
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter(order =>
        order.orderId.toLowerCase().includes(term) ||
        order.username.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    // Sort orders
    this.filteredOrders.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return this.sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
    });
    
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.ordersPerPage;
    const endIndex = startIndex + this.ordersPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.ordersPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  viewItems(order: OrderDisplay): void {
    this.selectedOrder = order;
    this.showItemsModal = true;
  }

  viewProfile(order: OrderDisplay): void {
    this.selectedOrder = order;
    this.showProfileModal = true;
  }

  closeItemsModal(): void {
    this.showItemsModal = false;
    this.selectedOrder = null;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.selectedOrder = null;
  }

  updateOrderStatus(order: OrderDisplay): void {
    this.orderService.updateOrder(order._id, { orderStatus: order.status } as any).subscribe({
      next: (response) => {
        console.log('Order status updated:', response);
        alert('Order status updated successfully!');
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
        // Reload orders to reset the status
        this.loadOrders();
      }
    });
  }
}
