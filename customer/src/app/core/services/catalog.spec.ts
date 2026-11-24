import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '../api.config';
import { StorefrontProduct } from '@contracts/product';
import { CatalogService } from './catalog';

describe('CatalogService', () => {
  let service: CatalogService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CatalogService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('keeps published products even when they are not sold individually', () => {
    const products = [
      product(1, 'bonbon', false, true),
      product(2, 'bar', true, false),
      product(3, 'box', false, false)
    ];

    service.products().subscribe(result => {
      expect(result.map(item => item.id)).toEqual([1, 2, 3]);
    });

    http.expectOne(`${API_URL}/storefront/products`).flush(products);
  });

  it('keeps featured products regardless of individual-sale flag', () => {
    service.featuredProducts().subscribe(result => {
      expect(result.map(item => item.id)).toEqual([1]);
      expect(result[0].featured).toBe(true);
    });

    http.expectOne(`${API_URL}/storefront/products`).flush([
      product(1, 'bonbon', false, true),
      product(2, 'box', false, false)
    ]);
  });
});

function product(id: number, type: 'bonbon' | 'bar' | 'box', sellIndividually: boolean, featured: boolean): StorefrontProduct {
  return {
    id,
    type,
    sellIndividually,
    name: { en: `Product ${id}`, ar: '' },
    description: { en: '', ar: '' },
    details: { en: '', ar: '' },
    imageUrl: '/uploads/product.jpg',
    galleryUrls: [],
    categoryId: null,
    badge: null,
    availability: { from: null, until: null },
    sku: '',
    weightGrams: 0,
    shelfLifeDays: 0,
    featured,
    sortOrder: id,
    allergens: [],
    price: 10,
    needsReprice: false,
    box: null,
    inStock: true,
    ingredientNames: []
  } as StorefrontProduct;
}
