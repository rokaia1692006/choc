import { Ingredient } from './ingredient';
import { Product } from './product';

export interface PriceBreakdown {
  ingredientCost: number;
  withProfit: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function recipeCost(recipe: Product['recipe'], ingredients: Ingredient[]): number {
  return recipe.reduce((sum, line) => {
    const ing = ingredients.find(i => i.id === line.ingredientId);
    return sum + (ing ? ing.costPerUnit * line.quantity : 0);
  }, 0);
}

export function boxCost(box: NonNullable<Product['box']>, bonbons: Product[]): number {
  const unitCost = (id: number) => bonbons.find(b => b.id === id)?.ingredientCost ?? 0;

  const pieces = box.mode === 'fixed'
    ? box.fixedContents.reduce((s, c) => s + unitCost(c.bonbonId) * c.pieces, 0)
    : box.totalPieces * Math.max(0, ...box.allowedBonbonIds.map(unitCost));

  return pieces + box.packagingCost;
}

export function applyProfit(cost: number, profitPercent: number): PriceBreakdown {
  return { ingredientCost: round2(cost), withProfit: round2(cost * (1 + profitPercent / 100)) };
}