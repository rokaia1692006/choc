import { Component, Input, Output, EventEmitter, signal, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Product, productTypes } from '../../../core/models/products';
import { CartService } from '../../../core/services/cart';

interface FlavourSelection {
  variant: productTypes;
  quantity: number;
}

@Component({
  selector: 'app-variant-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variant-picker.html',
  styleUrl: './variant-picker.css'
})
export class VariantPicker implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Output() close = new EventEmitter<void>();

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  selected = signal<productTypes | null>(null);
  selections = signal<FlavourSelection[]>([]);

  constructor(private cartService: CartService) {}

  ngOnInit() {
    if (this.product.mixedBox) {
      this.selections.set(
        this.product.mixedBox.flavours.map(v => ({ variant: v, quantity: 0 }))
      );
    }
    if (this.isBrowser) document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    if (this.isBrowser) document.body.style.overflow = '';
  }

  sanitizeClassName(flavour: string): string {
    if (!flavour) return '';
    return flavour.toLowerCase().replace(/\s+/g, '-');
  }

  selectVariant(variant: productTypes) {
    if (!variant.available) return;
    this.selected.set(variant);
  }

  get finalPrice() {
    if (this.product.mixedBox) return this.product.price;
    const v = this.selected();
    return this.product.price + (v ? v.priceModifier : 0);
  }

  get totalSelected() {
    return this.selections().reduce((sum, s) => sum + s.quantity, 0);
  }

  get remaining() {
    return (this.product.mixedBox?.totalPieces || 0) - this.totalSelected;
  }

  get isBoxComplete() {
    return this.remaining === 0;
  }

  increment(index: number) {
    if (this.remaining < 4) return;
    const updated = [...this.selections()];
    updated[index] = { ...updated[index], quantity: updated[index].quantity + 4 };
    this.selections.set(updated);
  }

  decrement(index: number) {
    const updated = [...this.selections()];
    if (updated[index].quantity < 4) return;
    updated[index] = { ...updated[index], quantity: updated[index].quantity - 4 };
    this.selections.set(updated);
  }

  get boxRows(): (string | null)[][] {
    const all: (string | null)[] = [];
    this.selections().forEach(s => {
      for (let i = 0; i < s.quantity; i++) {
        all.push(s.variant.flavour);
      }
    });
    const total = this.product.mixedBox?.totalPieces || 0;
    while (all.length < total) all.push(null);

    const rows: (string | null)[][] = [];
    for (let i = 0; i < all.length; i += 4) {
      rows.push(all.slice(i, i + 4));
    }
    return rows;
  }

  addToCart() {
    if (this.product.mixedBox) {
      if (!this.isBoxComplete) return;
      const selectedFlavours = this.selections()
        .filter(s => s.quantity > 0)
        .map(s => `${s.quantity}x ${s.variant.label}`)
        .join(', ');
      this.cartService.addToCart({
        ...this.product,
        name: `${this.product.name} (${selectedFlavours})`,
      });
    } else {
      const variant = this.selected();
      if (!variant) return;
      this.cartService.addToCart({
        ...this.product,
        name: `${this.product.name} — ${variant.label}`,
        price: this.finalPrice,
        id: parseInt(`${this.product.id}${variant.id}`)
      });
    }
    this.close.emit();
  }
}