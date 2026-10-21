import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Order, OrderStatus } from '../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private readonly ORDERS_KEY = 'choooc_orders';
  private readonly BLOCKED_KEY = 'choooc_blocked_dates';

  getOrders(): Order[] {
    if (!this.isBrowser) return [];
    return JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
  }

  getOrdersByUser(userId: string): Order[] {
    return this.getOrders().filter(o => o.userId === userId);
  }

  getOrdersByPhone(phone: string): Order[] {
    return this.getOrders().filter(o => o.phone === phone);
  }

  saveOrder(order: Order): void {
    if (!this.isBrowser) return;
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }

  updateOrderStatus(orderId: string, status: OrderStatus): boolean {
    if (!this.isBrowser) return false;
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return false;
    orders[index].status = status;
    if (status === 'cancelled') {
      orders[index].cancelledAt = new Date().toISOString();
    }
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    return true;
  }

  cancelOrder(orderId: string): boolean {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
   
    if (!order || order.status !== 'pending') return false;
    return this.updateOrderStatus(orderId, 'cancelled');
  }

  // ── Blocked Dates (set by admin) ─────────────────────────

  getBlockedDates(): string[] {
    if (!this.isBrowser) return [];
    return JSON.parse(localStorage.getItem(this.BLOCKED_KEY) || '[]');
  }

  isDateBlocked(dateStr: string): boolean {
    return this.getBlockedDates().includes(dateStr);
  }

  blockDate(dateStr: string): void {
    if (!this.isBrowser) return;
    const dates = this.getBlockedDates();
    if (!dates.includes(dateStr)) {
      dates.push(dateStr);
      localStorage.setItem(this.BLOCKED_KEY, JSON.stringify(dates));
    }
  }

  unblockDate(dateStr: string): void {
    if (!this.isBrowser) return;
    const dates = this.getBlockedDates().filter(d => d !== dateStr);
    localStorage.setItem(this.BLOCKED_KEY, JSON.stringify(dates));
  }

  getMinDeliveryDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 2); 
    return d.toISOString().split('T')[0];
  }

  isDateValid(dateStr: string): boolean {
    if (!dateStr) return false;
    if (this.isDateBlocked(dateStr)) return false;
    const selected = new Date(dateStr);
    const min = new Date(this.getMinDeliveryDate());
    return selected >= min;
  }
}