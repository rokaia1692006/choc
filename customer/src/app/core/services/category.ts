import { Injectable, computed, inject, signal } from '@angular/core';
import { CatalogService } from './catalog';
import { Category } from '../models/products';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private catalog = inject(CatalogService);
  private _categories = signal<Category[]>([]);
  categories = computed(() => this._categories());
  error = signal('');

  load(): void {
    this.error.set('');
    this.catalog.categories().subscribe({
      next: categories => this._categories.set(categories),
      error: () => this.error.set('Could not load categories.')
    });
  }

  getById(id: number): Category | undefined {
    return this._categories().find(category => category.id === id);
  }
}