import { LocalizedText } from './Localized';

export type ProductType = 'bonbon' | 'bar' | 'box';
export type BoxMode = 'fixed' | 'mixed';
export type ProductStatus = 'draft' | 'active' | 'archived';
export type ProfitMode = 'markup' | 'margin';

export interface RecipeLine {
  ingredientId: number;
  quantity: number;
}

export interface Availability {
  from: string | null;
  until: string | null;
}

export interface BoxContent {
  bonbonId: number;
  pieces: number;
}

export interface BoxSpec {
  mode: BoxMode;
  totalPieces: number;
  rowSize: number;
  packagingCost: number;
  fixedContents: BoxContent[];
  allowedBonbonIds: number[];
}

export interface Product {
  id: number;
  type: ProductType;
  sellIndividually?: boolean;
  name: LocalizedText;
  description: LocalizedText;
  details: LocalizedText;
  imageUrl: string;
  galleryUrls: string[];
  categoryIds: number[] ;
  badge: LocalizedText | null;
  status: ProductStatus;
  availability: Availability;
  sku: string;
  weightGrams: number;
  shelfLifeDays: number;
  stockQuantity: number | null;
  featured: boolean;
  sortOrder: number;
  allergens: string[];
  profitPercent: number;
  profitMode: ProfitMode;
  roundTo: number;
  priceOverride: number | null;
  otherCost: number;
  ingredientCost: number;
  price: number;
  needsReprice: boolean;
  recipe: RecipeLine[];
  box: BoxSpec | null;
  sourceBarId?: number | null;
}

export type ProductInput = Omit<Product, 'id' | 'allergens' | 'ingredientCost' | 'price' | 'needsReprice'>;

export interface StorefrontBonbon {
  id: number;
  name: LocalizedText;
  imageUrl: string;
  available: boolean;
}

export interface StorefrontProduct extends Omit<Product, 'recipe' | 'ingredientCost' | 'profitPercent' | 'profitMode' | 'roundTo' | 'priceOverride' | 'otherCost' | 'needsReprice' | 'status' | 'stockQuantity' | 'box'> {
  inStock: boolean;
  ingredientNames: LocalizedText[];
  box: (Omit<BoxSpec, 'packagingCost' | 'allowedBonbonIds' | 'fixedContents'> & {
    bonbons: StorefrontBonbon[];
    fixedContents: (BoxContent & { name: LocalizedText })[];
  }) | null;
}