import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../core/api.config';
import { Order } from '../../core/models/order.model';

interface Stats { pendingOrders: number; ordersToday: number; revenue30d: number; productsOnSale: number; latest: Order[]; }

@Component({ selector: 'app-dashboard', imports: [CurrencyPipe, DatePipe, RouterLink], templateUrl: './dashboard.html', styleUrl: './dashboard.css' })
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  stats = signal<Stats | null>(null);
  error = signal('');
  ngOnInit() {
    this.http.get<Stats>(`${API_URL}/admin/dashboard`).subscribe({ next: s => this.stats.set(s), error: () => this.error.set('Could not load the dashboard.') });
  }
}
