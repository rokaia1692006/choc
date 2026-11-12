import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api.config';
import { Customer } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  list() { return this.http.get<Customer[]>(`${API_URL}/admin/customers`); }
}
