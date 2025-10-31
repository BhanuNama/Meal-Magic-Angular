import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-user-view-orders',
  templateUrl: './user-view-orders.html',
  styleUrls: ['./user-view-orders.css']
})
export class UserViewOrders implements OnInit {
  orders: OrderDisplay[] = [];
  selectedOrder: OrderDisplay | null = null;
  
  // Modals
  showTrackingModal: boolean = false;
  showItemsModal: boolean = false;
  showCancelModal: boolean = false;
  
  // Toast
  showToast: boolean = false;
  toastMessage: string = '';
  
  userId: string = '';

  constructor(private orderService: OrderService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getUserId();
    if (this.userId) {
      this.loadUserOrders();
    }
  }

  getUserId(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.userId = user.userId || user.id || user._id || '';
        console.log('User ID for orders:', this.userId);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  loadUserOrders(): void {
    this.orderService.getOrdersByUserId(this.userId).subscribe({
      next: (response: any) => {
        console.log('User orders loaded:', response);
        const ordersData = Array.isArray(response) ? response : (response.data || []);
        
        this.orders = ordersData.map((order: Order) => ({
          _id: order._id,
          orderId: order._id,
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
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.orders = [];
      }
    });
  }

  trackOrder(order: OrderDisplay): void {
    this.selectedOrder = order;
    this.showTrackingModal = true;
  }

  viewItems(order: OrderDisplay): void {
    this.selectedOrder = order;
    this.showItemsModal = true;
  }

  openCancelModal(order: OrderDisplay): void {
    if (order.status !== 'Pending') {
      this.toastr.warning('Only pending orders can be cancelled');
      return;
    }
    this.selectedOrder = order;
    this.showCancelModal = true;
  }

  confirmCancelOrder(): void {
    if (!this.selectedOrder) return;

    this.orderService.deleteOrder(this.selectedOrder._id).subscribe({
      next: (response) => {
        console.log('Order cancelled:', response);
        
        // Remove from local list
        this.orders = this.orders.filter(o => o._id !== this.selectedOrder!._id);
        
        this.showToast = true;
        this.toastMessage = 'Order cancelled successfully!';
        
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
        
        this.closeCancelModal();
      },
      error: (error) => {
        console.error('Error cancelling order:', error);
        this.toastr.error('Failed to cancel order. Please try again.');
        this.closeCancelModal();
      }
    });
  }

  closeTrackingModal(): void {
    this.showTrackingModal = false;
    this.selectedOrder = null;
  }

  closeItemsModal(): void {
    this.showItemsModal = false;
    this.selectedOrder = null;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.selectedOrder = null;
  }

  getTrackingSteps(): string[] {
    return ['Pending', 'Accepted', 'Preparing', 'OutForDelivery', 'Delivered'];
  }

  getCurrentStepIndex(): number {
    if (!this.selectedOrder) return 0;
    const steps = this.getTrackingSteps();
    return steps.indexOf(this.selectedOrder.status);
  }

  isStepCompleted(stepIndex: number): boolean {
    return stepIndex <= this.getCurrentStepIndex();
  }

  isStepActive(stepIndex: number): boolean {
    return stepIndex === this.getCurrentStepIndex();
  }
}
