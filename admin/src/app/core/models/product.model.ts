export type ProductStatus = 'draft' | 'active' | 'archived';
/** single = one bar or piece, set = box with fixed contents, mixed = customer picks the flavours */
export type BoxType = 'single' | 'set' | 'mixed';

export interface SeasonalWindow {
  seasonName: string;
  seasonNameAr?: string;
  startsAt: string;   // ISO 8601, UTC
  endsAt: string;     // ISO 8601, UTC, after startsAt
}

export interface ProductVariant {
  id: string;
  flavour: string;
  flavourAr?: string;
  label: string;
  labelAr?: string;
  priceModifier: number;
  crossSectionImage: string;
  available: boolean;
}

/** One line of a set box, for example 4 x caramel. */
export interface BoxItem {
  flavour: string;
  flavourAr?: string;
  quantity: number;
}

/** Customers choose from the product's available variants. */
export interface MixedBox {
  totalPieces: number;
  minPerFlavour: number;
  label?: string;
  labelAr?: string;
}

export interface Product {
  id: number;
  status: ProductStatus;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  detailedDescription?: string;
  detailedDescriptionAr?: string;
  price: number;
  image: string;
  images?: string[];
  categoryId: number;
  badge?: string;
  badgeAr?: string;

  boxType: BoxType;
  boxContents?: BoxItem[];          // set boxes
  mixedBox?: MixedBox | null;       // mixed boxes
  variantLabel?: string;
  variants?: ProductVariant[];

  isSeasonal: boolean;
  seasonal?: SeasonalWindow | null;

  sku?: string;
  ingredients?: string;
  ingredientsAr?: string;
  allergens?: string[];
  weightGrams?: number;
  shelfLifeDays?: number;
  stockQuantity?: number | null;
  featured?: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export interface Category {
  id: number;
  name: string;
  nameAr: string;
  sortOrder?: number;
  isActive?: boolean;
}
