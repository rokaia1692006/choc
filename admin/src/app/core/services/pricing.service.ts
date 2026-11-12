import { Injectable } from '@angular/core';
import { Ingredient, PackUnit, RecipeLine } from '../models/Ingredient.model';
import { PriceInput, PriceQuote, ProfitMode } from '../models/pricing.model';

export type BaseUnit = 'g' | 'ml' | 'pc';

const UNIT: Record<PackUnit, { base: BaseUnit; factor: number }> = {
  g: { base: 'g', factor: 1 },
  kg: { base: 'g', factor: 1000 },
  ml: { base: 'ml', factor: 1 },
  l: { base: 'ml', factor: 1000 },
  pc: { base: 'pc', factor: 1 },
};

const MAX_MARGIN = 0.9;

@Injectable({ providedIn: 'root' })
export class PricingService {
  readonly currency = 'EGP';

  baseOf(unit: PackUnit): BaseUnit {
    return UNIT[unit].base;
  }

  costPerBase(i: Pick<Ingredient, 'packSize' | 'packUnit' | 'packPrice'>): number {
    const total = i.packSize * UNIT[i.packUnit].factor;
    return total > 0 ? i.packPrice / total : 0;
  }

  lineCost(ing: Ingredient, line: RecipeLine): number | null {
    if (this.baseOf(line.unit) !== this.baseOf(ing.packUnit)) return null;
    return line.qty * UNIT[line.unit].factor * this.costPerBase(ing);
  }

  withProfit(cost: number, pct: number, mode: ProfitMode): number {
    const p = Math.max(pct, 0) / 100;
    return mode === 'markup' ? cost * (1 + p) : cost / (1 - Math.min(p, MAX_MARGIN));
  }

  roundUp(value: number, step: number): number {
    return step > 0 ? Math.ceil(value / step) * step : value;
  }

  quote(all: Ingredient[], lines: RecipeLine[], o: PriceInput): PriceQuote {
    const problems: string[] = [];

    const lineCosts = lines.map((line, n) => {
      const ing = all.find(a => a.id === line.ingredientId);
      if (!ing) return 0;
      const cost = this.lineCost(ing, line);
      if (cost === null) {
        problems.push(`Line ${n + 1}: ${ing.name} is bought in ${this.baseOf(ing.packUnit)}, not ${line.unit}.`);
        return 0;
      }
      return cost;
    });

    const ingredientsCost = lineCosts.reduce((a, b) => a + b, 0);
    const batchCost = ingredientsCost * (1 + o.wastePct / 100) + o.packagingCost + o.labourCost;
    const costPerPiece = o.yieldPieces > 0 ? batchCost / o.yieldPieces : 0;
    const suggested = this.roundUp(this.withProfit(costPerPiece, o.profitPct, o.profitMode), o.roundTo);

    if (o.yieldPieces <= 0) problems.push('Yield must be at least 1 piece.');
    return { lineCosts, ingredientsCost, batchCost, costPerPiece, profitAdded: suggested - costPerPiece, suggested, problems };
  }

  sellingPrice(q: PriceQuote, override: number | null): number {
    return override && override > 0 ? override : q.suggested;
  }
}