import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category as ApiCategory } from '@contracts/Category';
import { StorefrontProduct } from '@contracts/product';
import { API_URL } from '../api.config';
import { Category, Product, productTypes } from '../models/products';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private readonly productsUrl = `${API_URL}/storefront/products`;

  products(): Observable<Product[]> {
    return this.http.get<StorefrontProduct[]>(this.productsUrl).pipe(
      map(products => products
        .filter(product => product.type === 'box' || product.sellIndividually === true)
        .map(product => this.toProduct(product)))
    );
  }

  featuredProducts(): Observable<Product[]> {
    return this.products().pipe(map(products => products.filter(product => product.featured)));
  }

  product(id: number): Observable<Product> {
    return this.http.get<StorefrontProduct>(`${this.productsUrl}/${id}`).pipe(
      map(product => this.toProduct(product))
    );
  }

  categories(): Observable<Category[]> {
    return this.http.get<ApiCategory[]>(`${API_URL}/storefront/categories`).pipe(
      map(categories => categories
        .filter(category => category.isActive)
        .map(category => ({
          id: category.id,
          name: category.name.en,
          nameAr: category.name.ar
        })))
    );
  }

  private toProduct(source: StorefrontProduct): Product {
    const flavours: productTypes[] = source.box?.bonbons.map(bonbon => ({
      id: String(bonbon.id),
      flavour: bonbon.name.en,
      flavourAr: bonbon.name.ar,
      label: bonbon.name.en,
      labelAr: bonbon.name.ar,
      priceModifier: 0,
      crossSectionImage: bonbon.imageUrl,
      available: bonbon.available
    })) ?? [];

    return {
      id: source.id,
      type: source.type,
      sellIndividually: source.sellIndividually ?? source.type === 'bar',
      name: source.name.en,
      nameAr: source.name.ar,
      description: source.description.en,
      descriptionAr: source.description.ar,
      detailedDescription: source.details.en,
      detailedDescriptionAr: source.details.ar,
      price: source.price,
      image: source.imageUrl,
      images: source.galleryUrls,
      categoryId: source.categoryId ?? undefined,
      badge: source.badge?.en,
      badgeAr: source.badge?.ar,
      inStock: source.inStock,
      mixedBox: source.box?.mode === 'mixed' ? {
        totalPieces: source.box.totalPieces,
        minPerFlavour: 0,
        flavours
      } : null
    };
  }
}