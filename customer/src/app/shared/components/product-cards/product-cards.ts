import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/products';
import { CartService } from '../../../core/services/cart';
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
  constructor(private cart: CartService, private router: Router) {}

  get matchingCartQuantity(): number {
    const englishName = this.product.name;
    const arabicName = this.product.nameAr;
    return this.cart.cartItems().filter(item => {
      const cartProduct = item.product as Product & { baseNameEn?: string; baseNameAr?: string };
      return cartProduct.id === this.product.id
        || cartProduct.baseNameEn === englishName
        || (!!arabicName && cartProduct.baseNameAr === arabicName)
        || cartProduct.name.startsWith(`${englishName} - `)
        || cartProduct.name.startsWith(`${englishName} (`)
        || (!!arabicName && !!cartProduct.nameAr && (
          cartProduct.nameAr.startsWith(`${arabicName} - `)
          || cartProduct.nameAr.startsWith(`${arabicName} (`)
        ));
    }).reduce((sum, item) => sum + item.quantity, 0);
  }

  openProduct() {
    this.router.navigate(['/product', this.product.id]);
  }

  onAddClick() {
    if (this.product.variants?.length || this.product.mixedBox) {
      this.openProduct();
    } else {
      this.cart.addToCart(this.product);
    }
  }

  remove() {
    if (this.product.variants?.length || this.product.mixedBox) {
      this.router.navigate(['/product', this.product.id], {
        queryParams: { from: 'shop', cartChoices: '1' }
      });
      return;
    }
    const item = this.cart.cartItems().find(cartItem => cartItem.product.id === this.product.id);
    if (item) this.cart.updateQuantity(item.cartItemId, item.quantity - 1);
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