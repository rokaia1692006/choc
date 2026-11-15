import { LocalizedText } from './Localized';

export type PackUnit = 'g' | 'kg' | 'ml' | 'l' | 'pc';
export type BaseUnit = 'g' | 'ml' | 'pc';

export const PACK_UNITS: PackUnit[] = ['g', 'kg', 'ml', 'l', 'pc'];

export const UNIT: Record<PackUnit, { base: BaseUnit; factor: number }> = {
  g: { base: 'g', factor: 1 },
  kg: { base: 'g', factor: 1000 },
  ml: { base: 'ml', factor: 1 },
  l: { base: 'ml', factor: 1000 },
  pc: { base: 'pc', factor: 1 },
};

export interface Ingredient {
  id: number;
  name: LocalizedText;
  packSize: number;
  packUnit: PackUnit;
  packPrice: number;
  allergens: string[];
  supplier: string;
  unit: BaseUnit;
  costPerUnit: number;
}

export type IngredientInput = Omit<Ingredient, 'id' | 'unit' | 'costPerUnit'>;

export function costPerBaseUnit(i: Pick<IngredientInput, 'packSize' | 'packUnit' | 'packPrice'>): number {
  const total = i.packSize * UNIT[i.packUnit].factor;
  return total > 0 ? i.packPrice / total : 0;
}