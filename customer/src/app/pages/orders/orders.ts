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
  loading = signal(false);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.orderService.getMyOrders().subscribe({
      next: orders => this.orders.set([...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())),
      error: () => this.cancelError.set(this.lang.isArabic() ? 'تعذر تحميل الطلبات.' : 'Could not load orders.'),
      complete: () => this.loading.set(false)
    });
  }

  canCancel(order: Order): boolean {
    return order.status === 'pending';
  }

  cancelOrder(orderId: string) {
    this.cancelError.set('');
    this.cancellingId.set(orderId);
    this.orderService.cancelOrder(orderId).subscribe({
      next: () => this.loadOrders(),
      error: () => this.cancelError.set('This order can no longer be cancelled.'),
      complete: () => this.cancellingId.set(null)
    });
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
}