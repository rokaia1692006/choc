import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { OrderService } from '../../core/services/order-service';
import { Order } from '../../core/models/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  auth = inject(AuthService);
  orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  cancellingId = signal<string | null>(null);
  cancelError = signal('');

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const user = this.auth.user();
    let result: Order[] = [];
    if (user) {
      const byId = this.orderService.getOrdersByUser(user.id);
      const byPhone = this.orderService.getOrdersByPhone(user.phone);
      const map = new Map<string, Order>();
      [...byId, ...byPhone].forEach(o => map.set(o.id, o));
      result = Array.from(map.values());
    }
    result.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
    this.orders.set(result);
  }

  canCancel(order: Order): boolean {
    return order.status === 'pending';
  }

  cancelOrder(orderId: string) {
    this.cancelError.set('');
    this.cancellingId.set(orderId);
    const success = this.orderService.cancelOrder(orderId);
    if (success) {
      this.loadOrders();
    } else {
      this.cancelError.set('This order can no longer be cancelled.');
    }
    this.cancellingId.set(null);
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      preparing: 'Being Prepared',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }
}