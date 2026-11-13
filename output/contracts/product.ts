import { LocalizedText } from './Localized';

export type ProductType = 'bonbon' | 'bar' | 'box';
export type BoxMode = 'fixed' | 'mixed';

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
  name: LocalizedText;
  description: LocalizedText;
  details: LocalizedText;
  imageUrl: string;
  galleryUrls: string[];
  categoryId: number | null;
  badge: LocalizedText | null;
  isActive: boolean;
  availability: Availability;
  profitPercent: number;
  ingredientCost: number;
  price: number;
  needsReprice: boolean;
  recipe: RecipeLine[];
  box: BoxSpec | null;
}

export type ProductInput = Omit<Product, 'id' | 'ingredientCost' | 'price' | 'needsReprice'>;

export interface StorefrontBonbon {
  id: number;
  name: LocalizedText;
  imageUrl: string;
  available: boolean;
}

export interface StorefrontProduct extends Omit<Product, 'recipe' | 'ingredientCost' | 'profitPercent' | 'needsReprice' | 'isActive' | 'box'> {
  box: (Omit<BoxSpec, 'packagingCost' | 'allowedBonbonIds' | 'fixedContents'> & {
    bonbons: StorefrontBonbon[];
    fixedContents: (BoxContent & { name: LocalizedText })[];
  }) | null;
}