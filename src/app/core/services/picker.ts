import { Injectable, signal } from '@angular/core';
import { Product } from '../models/products';

@Injectable({ providedIn: 'root' })
export class PickerService {
  product = signal<Product | null>(null);

  open(product: Product) { this.product.set(product); }
  close() { this.product.set(null); }
}