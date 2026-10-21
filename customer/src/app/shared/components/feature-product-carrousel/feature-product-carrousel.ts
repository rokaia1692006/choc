import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ProductCards } from '../product-cards/product-cards';
import { Product } from '../../../core/models/products';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../../core/services/language';
import { LanguagesPipe } from '../../pipes/languages-pipe';

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
lang = inject(LanguageService);
  currentIndex = 0;
  private interval: any;
  slidesPerView = 3;
showDots = false;
  featuredProducts: Product[] = [
    { id: 1, name: 'Dark Truffle Box', description: 'Rich 70% cacao with hazelnut praline filling.', price: 120, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', categoryId: 2, badge: 'Bestseller' },
    { id: 2, name: 'Salted Caramel', description: 'Smooth milk chocolate with sea salt caramel.', price: 85, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', categoryId: 3, badge: 'New' },
    { id: 3, name: 'Gift Collection', description: 'Assorted premium bonbons, 24 pieces.', price: 250, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', categoryId: 4 },
    { id: 4, name: 'White Raspberry', description: 'Delicate white chocolate with raspberry ganache.', price: 95, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', categoryId: 5 },
    { id: 5, name: 'Hazelnut Praline', description: 'Classic praline wrapped in dark chocolate.', price: 110, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', categoryId: 6 },
    { id: 6, name: 'Matcha Green', description: 'Japanese matcha infused in creamy milk chocolate.', price: 100, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%２Ftse4.mm.bing.net%２Fth％２Fid％２FOIP.njRD6k_795CrG6AVtCi_QQHaDy％３Fpid％３DApi＆f＝１＆ipt＝４６６ｄ３９ｆ７６ｃ８２ｄf６６c４５４９２２d５２７９fbc１２db７４beff７８ccdbd８９３９４b１c０５f０１６fb＆ipo＝images', categoryId: 7 },
  {
  id: 7,
  name: 'Dark Truffle Box',
  description: 'Rich 70% cacao with hazelnut praline filling.',
  price: 120,
  image: '...',
  categoryId: 2,
  badge: 'Bestseller',
  variants: [
    { id: '1', flavour: 'kunafa pistachio', label: 'Kunafa Pistachio', priceModifier: 0, crossSectionImage: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', available: true },
    { id: '2', flavour: 'caramel', label: 'Caramel', priceModifier: 0, crossSectionImage: '', available: true },
    { id: '3', flavour: 'white', label: 'White Chocolate', priceModifier: 15, crossSectionImage: '', available: true },
  ]
},
  ];
  touchStartX = 0;
touchEndX = 0;

onTouchStart(e: TouchEvent) {
  this.touchStartX = e.changedTouches[0].screenX;
}

onTouchEnd(e: TouchEvent) {
  this.touchEndX = e.changedTouches[0].screenX;
  const diff = this.touchStartX - this.touchEndX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? this.next() : this.prev();
  }
}

  get slideWidth() { return 100 / this.slidesPerView; }
  
  get isMobile() { return this.slidesPerView === 1; }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) this.updateSlidesPerView();
  }

 updateSlidesPerView() {
  if (!this.isBrowser) return;
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

ngOnInit() {
  if (this.isBrowser) {
    setTimeout(() => {
      this.updateSlidesPerView();
      console.log('slidesPerView after timeout:', this.slidesPerView);
    }, 0);
    this.interval = setInterval(() => this.next(), 6000);
  }
}

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  get maxIndex() {
  return Math.max(0, this.featuredProducts.length - this.slidesPerView);
}

next() {
  this.currentIndex = this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1;
}

prev() {
  this.currentIndex = this.currentIndex <= 0 ? this.maxIndex : this.currentIndex - 1;
}

goTo(index: number) {
  this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
}
}