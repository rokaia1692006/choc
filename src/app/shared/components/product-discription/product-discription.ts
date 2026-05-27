import { CartService } from '../../../core/services/cart';
import { PickerService } from '../../../core/services/picker';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/products';
import { LanguageService } from '../../../core/services/language';
import { CurrencyPipe } from '../../pipes/currency-pipe';
import { LanguagesPipe } from '../../pipes/languages-pipe';
import { DescriptionService } from '../../../core/services/description';
@Component({
  selector: 'app-product-discription',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, LanguagesPipe],
  templateUrl: './product-discription.html',
  styleUrl: './product-discription.css'
})
export class ProductDiscription {
  @Input() product!: Product;
  @Output() close = new EventEmitter<void>();
desc = inject(DescriptionService);
  lang = inject(LanguageService);
  cart = inject(CartService);
  picker = inject(PickerService);

  get displayName(): string {
    return this.lang.isArabic() && this.product.nameAr
      ? this.product.nameAr : this.product.name;
  }
get displayDescription(): string {
  return this.lang.isArabic() && this.product.descriptionAr
    ? this.product.descriptionAr : this.product.description;
}
get displayBadge(): string {
  if (!this.product.badge) return '';
  return this.lang.isArabic() && this.product.badgeAr
    ? this.product.badgeAr : this.product.badge;
}
get displayDetailedDescription(): string {
  return (this.lang.isArabic() && this.product.detailedDescriptionAr)
    ? this.product.detailedDescriptionAr
    : (this.product.detailedDescription ?? '');
}
  addToCart() {
    if (this.product.variants?.length || this.product.mixedBox) {
      this.picker.open(this.product);
      this.close.emit(); 
    } else {
      this.cart.addToCart(this.product);
      this.close.emit();
    }
  }
}