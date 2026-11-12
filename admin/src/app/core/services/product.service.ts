import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api.config';
import { Product, ProductInput } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private url = `${API_URL}/admin/products`;
  list() { return this.http.get<Product[]>(this.url); }
  get(id: number) { return this.http.get<Product>(`${this.url}/${id}`); }
  create(p: ProductInput) { return this.http.post<Product>(this.url, p); }
  update(id: number, p: ProductInput) { return this.http.put<Product>(`${this.url}/${id}`, p); }
  remove(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
  upload(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ url: string }>(`${API_URL}/admin/uploads`, fd);
  }
}
