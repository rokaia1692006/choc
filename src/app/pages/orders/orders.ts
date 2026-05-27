import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { OrderService } from '../../core/services/order-service';
import { Order } from '../../core/models/order';
import { CurrencyService } from '../../core/services/currency';
import { LanguageService,Translations } from '../../core/services/language';
import {LanguagesPipe} from '../../shared/pipes/languages-pipe';
import {CurrencyPipe} from '../../shared/pipes/currency-pipe';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule,LanguagesPipe, CurrencyPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  auth = inject(AuthService);
  orderService = inject(OrderService);
  currency = inject(CurrencyService);
  lang = inject(LanguageService);

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
    const map: Record<string, keyof Translations> = { 
      pending: 'statusPending',
      preparing: 'statusPreparing',
      delivered: 'statusDelivered',
      cancelled: 'statusCancelled',
    };
    const key = map[status];
    return key ? this.lang.t()[key] : status;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(
      this.lang.current() === 'ar' ? 'ar-EG' : 'en-GB',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  }
  displayItemName(item: any): string {
  return this.lang.isArabic() && item.nameAr ? item.nameAr : item.name;
}
seedTestOrders() {
  const user = this.auth.user();
  if (!user) return;

  const base = {
  userId: user.id,
  customerName: user.name,
  phone: user.phone,
  address: '123 Test St',
  city: 'Cairo',
  subtotal: 270,
  deliveryFee: 30,  
  tax: 0,           
  total: 300,
  deliveryDate: '2026-05-30',
  placedAt: new Date().toISOString(),
  items: [{
    productId: 1,
    name: 'Chocolate Box',
    image: 'assets/images/box.png',
    price: 270,
    quantity: 1,
  }]
};

  const testOrders = [
    { ...base, id: 'test-1', status: 'pending' as const },
    { ...base, id: 'test-2', status: 'preparing' as const },
    { ...base, id: 'test-3', status: 'delivered' as const },
    { ...base, id: 'test-4', status: 'cancelled' as const },
  ];

  testOrders.forEach(o => this.orderService.saveOrder(o));
  this.loadOrders();
}
}