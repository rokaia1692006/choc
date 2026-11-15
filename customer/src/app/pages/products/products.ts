import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProductCards } from '../../shared/components/product-cards/product-cards';
import { Product } from '../../core/models/products';
import { CurrencyService } from '../../core/services/currency';
import { LanguageService } from '../../core/services/language';
import { LanguagesPipe } from '../../shared/pipes/languages-pipe';
import { CategoryService } from '../../core/services/category';
import { CatalogService } from '../../core/services/catalog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ProductCards, LanguagesPipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  searchQuery = signal('');
  sortBy = signal('default');
  allProducts = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');
  currency = inject(CurrencyService);
  lang = inject(LanguageService);
  categoryService = inject(CategoryService);
  private catalog = inject(CatalogService);
  selectedCategory = signal<number>(0);

  filteredProducts = computed(() => {
    let products = this.allProducts();
    if (this.selectedCategory() !== 0) {
      products = products.filter(product => product.categoryId === this.selectedCategory());
    }
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(query)
        || product.description.toLowerCase().includes(query)
        || (product.nameAr ?? '').includes(this.searchQuery().trim())
        || (product.descriptionAr ?? '').includes(this.searchQuery().trim())
      );
    }
    switch (this.sortBy()) {
      case 'price-asc': return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...products].sort((a, b) => b.price - a.price);
      case 'name': return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default: return products;
    }
  });

  ngOnInit(): void {
    this.categoryService.load();
    this.catalog.products().subscribe({
      next: products => {
        this.allProducts.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.lang.isArabic() ? 'تعذر تحميل المنتجات.' : 'Could not load products.');
        this.loading.set(false);
      }
    });
  }

  displayCategory(category: { name: string; nameAr: string }): string {
    return this.lang.isArabic() ? category.nameAr : category.name;
  }

  setCategory(id: number): void { this.selectedCategory.set(id); }
  setSort(event: Event): void { this.sortBy.set((event.target as HTMLSelectElement).value); }
  setSearch(event: Event): void { this.searchQuery.set((event.target as HTMLInputElement).value); }
}