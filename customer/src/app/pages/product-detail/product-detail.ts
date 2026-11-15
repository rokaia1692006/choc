import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { Product, productTypes } from '../../core/models/products';
import { CartItem, CartService } from '../../core/services/cart';
import { LanguageService } from '../../core/services/language';
import { CatalogService } from '../../core/services/catalog';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';

interface FlavourSelection {
  variant: productTypes;
  quantity: number;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private cart = inject(CartService);
  private router = inject(Router);
  private catalog = inject(CatalogService);
  lang = inject(LanguageService);
  product = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.catalog.product(id).pipe(catchError(() => of(undefined))))
    ),
    { initialValue: undefined }
  );
  activeImage = signal<string | null>(null);
  selectedVariant = signal<productTypes | null>(null);
  selections = signal<FlavourSelection[]>([]);
  toastVisible = signal(false);
  cartChoicesOpen = signal(false);
  private cartChoicesRequested = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('cartChoices') === '1')),
    { initialValue: this.route.snapshot.queryParamMap.get('cartChoices') === '1' }
  );
  private toastTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      const product = this.product();
      this.activeImage.set(product?.image ?? null);
      this.selectedVariant.set(null);
      this.selections.set(product?.mixedBox?.flavours.map(variant => ({ variant, quantity: 0 })) ?? []);
    });
    effect(() => this.cartChoicesOpen.set(this.cartChoicesRequested()));
  }

  get configuredCartItems(): CartItem[] {
    const product = this.product();
    if (!product) return [];
    return this.cart.cartItems().filter(item => {
      const cartProduct = item.product as Product & { baseNameEn?: string; baseNameAr?: string };
      return cartProduct.id === product.id
        || cartProduct.baseNameEn === product.name
        || (!!product.nameAr && cartProduct.baseNameAr === product.nameAr)
        || cartProduct.name.startsWith(`${product.name} - `)
        || cartProduct.name.startsWith(`${product.name} (`)
        || (!!product.nameAr && !!cartProduct.nameAr && (
          cartProduct.nameAr.startsWith(`${product.nameAr} - `)
          || cartProduct.nameAr.startsWith(`${product.nameAr} (`)
        ));
    });
  }

  get configuredCartTotal(): number {
    return this.configuredCartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  cartLineName(item: CartItem): string {
    return this.lang.isArabic() && item.product.nameAr ? item.product.nameAr : item.product.name;
  }

  decreaseCartItem(item: CartItem): void {
    this.cart.updateQuantity(item.cartItemId, item.quantity - 1);
  }

  increaseCartItem(item: CartItem): void {
    this.cart.addToCart(item.product);
  }

  removeCartItem(item: CartItem): void {
    this.cart.removeFromCart(item.cartItemId);
  }

  closeCartChoices(): void {
    this.cartChoicesOpen.set(false);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { cartChoices: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  get displayName(): string {
    const product = this.product();
    return this.lang.isArabic() && product?.nameAr ? product.nameAr : product?.name ?? '';
  }

  get displayDescription(): string {
    const product = this.product();
    if (!product) return '';
    if (this.lang.isArabic()) return product.detailedDescriptionAr || product.descriptionAr || product.detailedDescription || product.description;
    return product.detailedDescription || product.description;
  }

  get displayPrice(): number {
    const product = this.product();
    return (product?.price ?? 0) + (this.selectedVariant()?.priceModifier ?? 0);
  }

  get remainingPieces(): number {
    const total = this.product()?.mixedBox?.totalPieces ?? 0;
    return total - this.selections().reduce((sum, selection) => sum + selection.quantity, 0);
  }

  get canAddToCart(): boolean {
    const product = this.product();
    if (!product) return false;
    if (product.mixedBox) return this.remainingPieces === 0;
    if (product.variants?.length) return this.selectedVariant() !== null;
    return true;
  }

  get configuredCartProduct(): Product | null {
    const product = this.product();
    if (!product) return null;

    if (product.mixedBox) {
      if (this.remainingPieces !== 0) return null;
      const selected = this.selections().filter(selection => selection.quantity > 0);
      const variantsEn = selected.map(selection => `${selection.quantity}x ${selection.variant.label}`).join(', ');
      const variantsAr = selected.map(selection => `${selection.quantity}x ${selection.variant.labelAr || selection.variant.label}`).join(', ');
      return {
        ...product,
        name: `${product.name} (${variantsEn})`,
        nameAr: `${product.nameAr || product.name} (${variantsAr})`
      };
    }

    const variant = this.selectedVariant();
    if (product.variants?.length) {
      if (!variant) return null;
      return {
        ...product,
        name: `${product.name} - ${variant.label}`,
        nameAr: `${product.nameAr || product.name} - ${variant.labelAr || variant.label}`,
        price: product.price + variant.priceModifier,
        id: product.id
      };
    }

    return product;
  }

  get configuredCartItemId(): string | null {
    const product = this.configuredCartProduct;
    return product ? `${product.id}-${product.name.replace(/\s+/g, '')}` : null;
  }

  get configuredCartQuantity(): number {
    const cartItemId = this.configuredCartItemId;
    if (!cartItemId) return 0;
    return this.cart.cartItems().find(item => item.cartItemId === cartItemId)?.quantity ?? 0;
  }

  selectImage(image: string): void {
    this.activeImage.set(image);
  }

  selectVariant(variant: productTypes): void {
    if (!variant.available) return;
    this.selectedVariant.set(variant);
    this.activeImage.set(variant.crossSectionImage || this.product()?.image || null);
  }

  changeBoxQuantity(index: number, amount: number): void {
    const selection = this.selections()[index];
    if (!selection || !selection.variant.available) return;
    if (amount > 0 && this.remainingPieces < amount) return;
    if (amount < 0 && selection.quantity < Math.abs(amount)) return;
    this.selections.update(items => items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, quantity: item.quantity + amount } : item
    ));
  }

  addToCart(): void {
    const product = this.configuredCartProduct;
    if (!product || !this.canAddToCart) return;
    this.cart.addToCart(product);
    this.showAddedToast();
  }

  updateConfiguredQuantity(amount: number): void {
    const cartItemId = this.configuredCartItemId;
    if (!cartItemId) return;
    const quantity = this.configuredCartQuantity + amount;
    if (amount > 0) {
      const product = this.configuredCartProduct;
      if (product) this.cart.addToCart(product);
      this.showAddedToast();
      return;
    }
    this.cart.updateQuantity(cartItemId, quantity);
  }

  private showAddedToast(): void {
    this.toastVisible.set(true);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 1800);
  }

  backToShop(): void {
    if (this.route.snapshot.queryParamMap.get('from') === 'cart') {
      this.router.navigateByUrl('/cart');
      return;
    }
    this.router.navigateByUrl('/shop');
  }
}