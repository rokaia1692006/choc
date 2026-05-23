import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/products';
import { CartService } from '../../../core/services/cart';
import { PickerService } from '../../../core/services/picker';

@Component({
  selector: 'app-product-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-cards.html',
  styleUrl: './product-cards.css'
})
export class ProductCards {
  @Input() product!: Product;

  constructor(private cart: CartService, private picker: PickerService) {}

  get quantity() {
    return this.cart.cartItems()
      .filter(i => Math.floor(i.product.id / 10) === this.product.id || i.product.id === this.product.id)
      .reduce((sum, i) => sum + i.quantity, 0);
  }

  onAddClick() {
    if (this.product.variants?.length || this.product.mixedBox) {
      this.picker.open(this.product);
    } else {
      this.cart.addToCart(this.product);
    }
  }

  remove() {
    const item = this.cart.cartItems().find(i => i.product.id === this.product.id);
    if (item) {
      const cartItemId = `${this.product.id}-${this.product.name.replace(/\s+/g, '')}`;
      this.cart.updateQuantity(cartItemId, item.quantity - 1);
    }
  }
}