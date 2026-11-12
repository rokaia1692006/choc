import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api.config';
import { Category } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private url = `${API_URL}/admin/categories`;
  list() { return this.http.get<Category[]>(this.url); }
  create(c: Omit<Category, 'id'>) { return this.http.post<Category>(this.url, c); }
  update(id: number, c: Omit<Category, 'id'>) { return this.http.put<Category>(`${this.url}/${id}`, c); }
  remove(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
