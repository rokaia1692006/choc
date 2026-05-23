import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Category } from '../models/products';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private readonly KEY = 'choooc_categories';

  private readonly defaults: Category[] = [
    { id: 0, name: 'All',      nameAr: 'الكل' },
    { id: 1, name: 'Truffles', nameAr: 'ترافل' },
    { id: 2, name: 'Caramel',  nameAr: 'كراميل' },
    { id: 3, name: 'Gifts',    nameAr: 'هدايا' },
    { id: 4, name: 'White',    nameAr: 'أبيض' },
  { id: 5, name: 'Praline',  nameAr: 'برالين' },
  { id: 6, name: 'Special',  nameAr: 'مميز' },
];

getById(id: number): Category | undefined {
  return this._categories().find(c => c.id === id);
}
  

  private _categories = signal<Category[]>(this.load());
  categories = computed(() => this._categories());

  private load(): Category[] {
    if (!this.isBrowser) return this.defaults;
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : this.defaults;
    } catch { return this.defaults; }
  }

  private save() {
    if (this.isBrowser)
      localStorage.setItem(this.KEY, JSON.stringify(this._categories()));
  }


  addCategory(cat: Category) {
    this._categories.update(cats => [...cats, cat]);
    this.save();
  }

updateCategory(id: number, data: Partial<Category>) {
  this._categories.update(cats =>
    cats.map(c => c.id === id ? { ...c, ...data } : c)
  );
  this.save();
}


deleteCategory(id: number) {
  this._categories.update(cats => cats.filter(c => c.id !== id));
  this.save();
}

}