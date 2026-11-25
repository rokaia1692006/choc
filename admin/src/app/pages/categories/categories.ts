import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product, Category } from '../../core/models/product.model';

@Component({
  imports: [FormsModule],
  selector: 'app-categories',
  styleUrl: './categories.css',
  templateUrl: './categories.html',
})
export class Categories implements OnInit {
  private productSvc = inject(ProductService);
  private categorySvc = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  error = signal('');

  target = signal<'new' | number>('new');
  newNameEn = '';
  newNameAr = '';
  picked = signal<Set<number>>(new Set());
  busy = signal(false);

  canApply = computed(() =>
    this.target() === 'new' ? !!this.newNameEn.trim() : true
  );

  ngOnInit() { this.load(); }

  load() {
    this.productSvc.list().subscribe({
      next: p => { this.products.set(p); this.syncPicked(); },
      error: () => this.error.set('Could not load products.')
    });
    this.categorySvc.list().subscribe({
      next: c => this.categories.set(c),
      error: () => this.error.set('Could not load categories.')
    });
  }

  onTargetChange(v: 'new' | number) {
    this.target.set(v);
    this.syncPicked();
  }

  private syncPicked() {
    const t = this.target();
    this.picked.set(new Set(
      t === 'new' ? [] : this.products().filter(p => p.categoryIds?.includes(t)).map(p => p.id)
    ));
  }

  togglePick(id: number) {
    const s = new Set(this.picked());
    s.has(id) ? s.delete(id) : s.add(id);
    this.picked.set(s);
  }

  async applyCategory() {
    this.busy.set(true);
    this.error.set('');
    try {
      let categoryId: number;
      if (this.target() === 'new') {
        const created = await firstValueFrom(this.categorySvc.create({
          name: { en: this.newNameEn.trim(), ar: this.newNameAr.trim() },
          sortOrder: 0,
          isActive: true,
        }));
        categoryId = created.id;
      } else {
        categoryId = this.target() as number;
      }
      await firstValueFrom(this.categorySvc.setCategoryProducts(categoryId, [...this.picked()]));
      this.newNameEn = this.newNameAr = '';
      this.target.set(categoryId);
      this.load();
    } catch {
      this.error.set('Could not save the category. Please try again.');
    } finally {
      this.busy.set(false);
    }
  }

  async deleteCategory() {
    const t = this.target();
    if (t === 'new') return;
    const name = this.categories().find(c => c.id === t)?.name.en;
    if (!confirm(`Delete category "${name}"? Products stay, they just lose this category.`)) return;
    try {
      await firstValueFrom(this.categorySvc.remove(t));
      this.target.set('new');
      this.load();
    } catch {
      this.error.set('Could not delete the category.');
    }
  }
}