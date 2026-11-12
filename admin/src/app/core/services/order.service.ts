import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '../api.config';
import { Order, OrderStatus, Paged } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private url = `${API_URL}/admin/orders`;
  list(status?: OrderStatus | '', page = 1) {
    let params = new HttpParams().set('page', page).set('pageSize', 20);
    if (status) params = params.set('status', status);
    return this.http.get<Paged<Order>>(this.url, { params });
  }
  setStatus(id: string, status: OrderStatus) {
    return this.http.patch<Order>(`${this.url}/${id}/status`, { status });
  }
}
