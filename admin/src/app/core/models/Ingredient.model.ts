import { ProfitMode } from './pricing.model';

export type PackUnit = 'g' | 'kg' | 'ml' | 'l' | 'pc';
export const PACK_UNITS: PackUnit[] = ['g', 'kg', 'ml', 'l', 'pc'];

export interface Ingredient {
  id?: number;
  name: string;
  packSize: number;
  packUnit: PackUnit;
  packPrice: number;
  allergens: string;
  supplier: string;
}

export interface RecipeLine {
  ingredientId: number | null;
  qty: number;
  unit: PackUnit;
}

export interface RecipeProductDraft {
  name: string;
  description: string;
  yieldPieces: number;
  wastePct: number;
  packagingCost: number;
  labourCost: number;
  profitPct: number;
  profitMode: ProfitMode;
  roundTo: number;
  priceOverride: number | null;
  lines: RecipeLine[];
}