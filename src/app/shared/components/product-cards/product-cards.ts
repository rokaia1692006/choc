import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/products';
import { CartService } from '../../../core/services/cart';
import { PickerService } from '../../../core/services/picker';
import { CurrencyService } from '../../../core/services/currency';
import {inject} from '@angular/core';
import { LanguageService ,Translations} from '../../../core/services/language';
import { CurrencyPipe } from '../../pipes/currency-pipe';
import { LanguagesPipe } from '../../pipes/languages-pipe';
@Component({
  selector: 'app-product-cards',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, LanguagesPipe],
  templateUrl: './product-cards.html',
  styleUrl: './product-cards.css'
})
export class ProductCards {
  @Input() product!: Product;
currency = inject(CurrencyService);
lang = inject(LanguageService);
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
  get displayName(): string {
    return this.lang.isArabic() && this.product.nameAr
      ? this.product.nameAr
      : this.product.name;
  }

  get displayDescription(): string {
    return this.lang.isArabic() && this.product.descriptionAr
      ? this.product.descriptionAr
      : this.product.description;
  }
get displayBadge(): string {
  const map: Record<string, keyof Translations> = {
    'Bestseller': 'badgeBestseller',
    'New': 'badgeNew',
    'Customise': 'badgeCustomise',
    'Flavours': 'badgeFlavours',
  };
  const key = map[this.product.badge ?? ''];
  return key ? (this.lang.t()[key] as string) : (this.product.badge ?? '');
}
}