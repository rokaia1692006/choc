import { Injectable, signal, computed, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/products';

export interface CartItem {
  cartItemId: string; 
  product: Product;
  quantity: number;
}

interface CachedCart {
  items: CartItem[];
  expiry: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private readonly CACHE_KEY = 'choooc_cart';
  private readonly EXPIRY_MS = 2 * 24 * 60 * 60 * 1000; 

  private items = signal<CartItem[]>(this.loadFromStorage());

  cartItems = computed(() => this.items());
  cartCount = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));
  cartTotal = computed(() => this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0));

  constructor() {
    effect(() => {
      this.saveToStorage(this.items());
    });
  }

  private loadFromStorage(): CartItem[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      if (!raw) return [];
      const cached: CachedCart = JSON.parse(raw);
      if (Date.now() > cached.expiry) {
        localStorage.removeItem(this.CACHE_KEY);
        return [];
      }
      return cached.items;
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]) {
    if (!this.isBrowser) return;
    try {
      const cached: CachedCart = {
        items,
        expiry: Date.now() + this.EXPIRY_MS
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cached));
    } catch {}
  }

  addToCart(product: Product) {
    const current = this.items();
 
    const targetCartId = `${product.id}-${product.name.replace(/\s+/g, '')}`;
    
    const existing = current.find(i => i.cartItemId === targetCartId);
    if (existing) {
      this.items.set(current.map(i =>
        i.cartItemId === targetCartId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      this.items.set([...current, { cartItemId: targetCartId, product, quantity: 1 }]);
    }
  }

  removeFromCart(cartItemId: string) {
    this.items.set(this.items().filter(i => i.cartItemId !== cartItemId));
  }

  updateQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }
    this.items.set(this.items().map(i =>
      i.cartItemId === cartItemId ? { ...i, quantity } : i
    ));
  }

  clearCart() {
    this.items.set([]);
    if (this.isBrowser) localStorage.removeItem(this.CACHE_KEY);
  }

  getitems() {
    return this.items();
  }
}