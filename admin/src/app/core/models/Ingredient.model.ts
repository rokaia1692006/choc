import { LocalizedText } from '@contracts/Localized';
import { PackUnit } from '@contracts/ingredient';
import { ProfitMode } from './pricing.model';

export { PACK_UNITS } from '@contracts/ingredient';
export type { Ingredient, IngredientInput, PackUnit, BaseUnit } from '@contracts/ingredient';

export interface RecipeLine {
  ingredientId: number | null;
  qty: number;
  unit: PackUnit;
}

export interface RecipeProductDraft {
  type: 'bonbon' | 'bar';
  name: LocalizedText;
  description: LocalizedText;
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