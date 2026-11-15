import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ProductCards } from '../product-cards/product-cards';
import { Product } from '../../../core/models/products';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../../core/services/language';
import { LanguagesPipe } from '../../pipes/languages-pipe';
import { CatalogService } from '../../../core/services/catalog';

@Component({
  selector: 'app-feature-product-carrousel',
  standalone: true,
  imports: [CommonModule, ProductCards, MatIconModule, LanguagesPipe],
  templateUrl: './feature-product-carrousel.html',
  styleUrl: './feature-product-carrousel.css'
})
export class FeatureProductCarrousel implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private catalog = inject(CatalogService);
  lang = inject(LanguageService);
  currentIndex = 0;
  private interval: ReturnType<typeof setInterval> | undefined;
  slidesPerView = 3;
  showDots = false;
  featuredProducts = signal<Product[]>([]);
  touchStartX = 0;
  touchEndX = 0;

  ngOnInit(): void {
    this.catalog.featuredProducts().subscribe({
      next: products => this.featuredProducts.set(products),
      error: () => this.featuredProducts.set([])
    });
    if (this.isBrowser) {
      this.updateSlidesPerView();
      this.interval = setInterval(() => this.next(), 6000);
    }
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    const difference = this.touchStartX - this.touchEndX;
    if (Math.abs(difference) > 50) difference > 0 ? this.next() : this.prev();
  }

  get slideWidth(): number { return 100 / this.slidesPerView; }
  get isMobile(): boolean { return this.slidesPerView === 1; }
  get maxIndex(): number { return Math.max(0, this.featuredProducts().length - this.slidesPerView); }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isBrowser) this.updateSlidesPerView();
  }

  private updateSlidesPerView(): void {
    if (window.innerWidth <= 480) {
      this.slidesPerView = 1;
      this.showDots = true;
    } else if (window.innerWidth <= 1024) {
      this.slidesPerView = 2;
      this.showDots = false;
    } else {
      this.slidesPerView = 3;
      this.showDots = false;
    }
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
  }

  next(): void {
    this.currentIndex = this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1;
  }

  prev(): void {
    this.currentIndex = this.currentIndex <= 0 ? this.maxIndex : this.currentIndex - 1;
  }

  goTo(index: number): void {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
  }
}