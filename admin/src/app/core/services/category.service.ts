import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api.config';
import { Category } from '../models/product.model';
import { LocalizedText } from '@contracts/Localized';

export interface CategoryInput {
  name: LocalizedText;
  sortOrder: number;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private url = `${API_URL}/admin/categories`;

  list() { return this.http.get<Category[]>(this.url); }
  create(body: CategoryInput) { 
    return this.http.post<Category>(this.url, body); 
  }
  remove(id: number) { 
    return this.http.delete<void>(`${this.url}/${id}`); 
  }
  setCategoryProducts(categoryId: number, productIds: number[]) {
    return this.http.put<void>(`${this.url}/${categoryId}/products`, { productIds });
  }
}