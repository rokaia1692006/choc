import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart';
import { VariantPicker } from '../../shared/components/variant-picker/variant-picker'; // Import your modal component
import { Product } from '../../core/models/products';
import { LanguageService } from '../../core/services/language';
import { LanguagesPipe } from '../../shared/pipes/languages-pipe';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';
import {inject} from '@angular/core';
import { CategoryService } from '../../core/services/category';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, VariantPicker, LanguagesPipe, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  activeProductForModal: Product | null = null;
  lang = inject(LanguageService);
categoryService = inject(CategoryService); 

  constructor(public cartService: CartService) {}

  displayName(product: Product): string {
    return this.lang.isArabic() && product.nameAr ? product.nameAr : product.name;
  }

displayCategory(product: Product): string {
    const cat = product.categoryId != null
      ? this.categoryService.getById(product.categoryId)
      : undefined;
    if (!cat) return product.category ?? '';
    return this.lang.isArabic() ? cat.nameAr : cat.name;
  }
  increment(item: any) {
    if (item.product.mixedBox) {
      this.activeProductForModal = {
        ...item.product,
        name: item.product.baseName || item.product.name.split(' (')[0]
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