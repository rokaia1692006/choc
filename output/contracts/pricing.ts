import { Ingredient, PackUnit, UNIT } from './ingredient';
import { Product, ProfitMode, RecipeLine } from './product';

export interface PriceBreakdown {
  ingredientCost: number;
  withProfit: number;
}

export interface BatchLine {
  ingredientId: number;
  qty: number;
  unit: PackUnit;
}

const MAX_MARGIN = 0.9;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function recipeCost(recipe: Product['recipe'], ingredients: Ingredient[]): number {
  return recipe.reduce((sum, line) => {
    const ing = ingredients.find(i => i.id === line.ingredientId);
    return sum + (ing ? ing.costPerUnit * line.quantity : 0);
  }, 0);
}

export function productCost(product: Pick<Product, 'recipe' | 'otherCost'>, ingredients: Ingredient[]): number {
  return recipeCost(product.recipe, ingredients) + product.otherCost;
}

export function boxCost(box: NonNullable<Product['box']>, bonbons: Product[]): number {
  const unitCost = (id: number) => bonbons.find(b => b.id === id)?.ingredientCost ?? 0;

  const pieces = box.mode === 'fixed'
    ? box.fixedContents.reduce((s, c) => s + unitCost(c.bonbonId) * c.pieces, 0)
    : box.totalPieces * Math.max(0, ...box.allowedBonbonIds.map(unitCost));

  return pieces + box.packagingCost;
}

export function withProfit(cost: number, profitPercent: number, mode: ProfitMode): number {
  const p = Math.max(profitPercent, 0) / 100;
  return mode === 'markup' ? cost * (1 + p) : cost / (1 - Math.min(p, MAX_MARGIN));
}

export function roundUp(value: number, step: number): number {
  return step > 0 ? Math.ceil(value / step) * step : value;
}

export function applyProfit(cost: number, profitPercent: number, mode: ProfitMode, roundTo: number): PriceBreakdown {
  return {
    ingredientCost: round2(cost),
    withProfit: round2(roundUp(withProfit(cost, profitPercent, mode), roundTo)),
  };
}

export function finalPrice(computed: number, priceOverride: number | null): number {
  return priceOverride && priceOverride > 0 ? priceOverride : computed;
}

export function recipeFromBatch(lines: BatchLine[], yieldPieces: number, wastePct: number): RecipeLine[] {
  if (yieldPieces <= 0) return [];
  return lines
    .filter(l => l.qty > 0)
    .map(l => ({
      ingredientId: l.ingredientId,
      quantity: (l.qty * UNIT[l.unit].factor * (1 + wastePct / 100)) / yieldPieces,
    }));
}

export function otherCostFromBatch(packagingCost: number, labourCost: number, yieldPieces: number): number {
  return yieldPieces > 0 ? (packagingCost + labourCost) / yieldPieces : 0;
}