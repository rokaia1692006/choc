import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';

@Component({ selector: 'app-orders', imports: [CurrencyPipe, DatePipe], templateUrl: './orders.html', styleUrl: './orders.css' })
export class Orders implements OnInit {
  private svc = inject(OrderService);
  orders = signal<Order[]>([]);
  filter = signal<OrderStatus | ''>('');
  error = signal('');
  statuses: OrderStatus[] = ['pending', 'preparing', 'delivered', 'cancelled'];

  ngOnInit() { this.load(); }
  load() {
    this.svc.list(this.filter()).subscribe({ next: r => this.orders.set(r.items), error: () => this.error.set('Could not load orders.') });
  }
  setFilter(v: string) { this.filter.set(v as OrderStatus | ''); this.load(); }
  change(o: Order, v: string) {
    const status = v as OrderStatus;
    if (status === 'cancelled' && !confirm(`Cancel order ${o.id}?`)) { this.load(); return; }
    this.svc.setStatus(o.id, status).subscribe({
      next: u => this.orders.update(list => list.map(x => (x.id === u.id ? u : x))),
      error: () => { this.error.set('Could not update the order.'); this.load(); },
    });
  }
}
