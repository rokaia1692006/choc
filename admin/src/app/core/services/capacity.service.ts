import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api.config';
import { CapacityResponse, CapacitySettings } from '../models/capacity.model';

@Injectable({ providedIn: 'root' })
export class CapacityService {
  private http = inject(HttpClient);
  private url = `${API_URL}/admin/capacity`;
  get() { return this.http.get<CapacityResponse>(this.url); }
  save(s: CapacitySettings) { return this.http.put<void>(this.url, s); }
  setDay(date: string, body: { open: boolean; maxOrders: number }) { return this.http.put<void>(`${this.url}/${date}`, body); }
  clearDay(date: string) { return this.http.delete<void>(`${this.url}/${date}`); }
}
