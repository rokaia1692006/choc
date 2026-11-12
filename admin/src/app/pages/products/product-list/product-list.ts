import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { seasonState } from '../../../core/models/product.utils';

@Component({ selector: 'app-product-list', imports: [RouterLink, CurrencyPipe, DatePipe], templateUrl: './product-list.html', styleUrl: './product-list.css' })
export class ProductList implements OnInit {
  private svc = inject(ProductService);
  products = signal<Product[]>([]);
  error = signal('');
  season = seasonState;

  ngOnInit() { this.load(); }
  load() { this.svc.list().subscribe({ next: p => this.products.set(p), error: () => this.error.set('Could not load products.') }); }
  remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    this.svc.remove(p.id).subscribe({ next: () => this.load(), error: () => this.error.set('Could not delete the product.') });
  }
}
