import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models/order';
import { API_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private readonly ordersUrl = `${API_URL}/orders`;

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.ordersUrl}/mine`, { withCredentials: true });
  }

  getReceipt(id: string, phone: string): Observable<Order> {
    const params = new HttpParams().set('phone', phone);
    return this.http.get<Order>(`${this.ordersUrl}/${encodeURIComponent(id)}/receipt`, { params });
  }

  saveOrder(order: Omit<Order, 'id' | 'placedAt' | 'status' | 'cancelledAt'>): Observable<Order> {
    return this.http.post<Order>(this.ordersUrl, order, { withCredentials: true });
  }

  cancelOrder(orderId: string): Observable<Order> {
    return this.http.delete<Order>(`${this.ordersUrl}/${encodeURIComponent(orderId)}`, { withCredentials: true });
  }

  getBlockedDates(from: string, to: string): Observable<string[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<string[]>(`${API_URL}/delivery/blocked-dates`, { params });
  }

  getMinDeliveryDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  }

  isDateValid(dateStr: string): boolean {
    return Boolean(dateStr) && new Date(dateStr) >= new Date(this.getMinDeliveryDate());
  }
}