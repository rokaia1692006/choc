import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart';
import { VariantPicker } from '../../shared/components/variant-picker/variant-picker'; // Import your modal component
import { Product } from '../../core/models/products';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, VariantPicker],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  activeProductForModal: Product | null = null;

  constructor(public cartService: CartService) {}

  increment(item: any) {
   
    if (item.product.mixedBox) {
    
      this.activeProductForModal = {
        ...item.product,
        name: item.product.baseName || item.product.name.split(' (')[0] // strips past flavor names if appended
      };
    } else {
     
      this.cartService.updateQuantity(item.cartItemId, item.quantity + 1);
    }
  }

  decrement(cartItemId: string, qty: number) {
    this.cartService.updateQuantity(cartItemId, qty - 1);
  }

  closeModal() {
    this.activeProductForModal = null;
  }
}