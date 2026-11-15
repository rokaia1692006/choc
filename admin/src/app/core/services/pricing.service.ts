import { Injectable } from '@angular/core';
import { Ingredient, PackUnit, RecipeLine } from '../models/Ingredient.model';
import { PriceInput, PriceQuote, ProfitMode } from '../models/pricing.model';
import { BaseUnit, UNIT, costPerBaseUnit } from '@contracts/ingredient';
import { roundUp, withProfit } from '@contracts/pricing';

@Injectable({ providedIn: 'root' })
export class PricingService {
  readonly currency = 'EGP';

  baseOf(unit: PackUnit): BaseUnit {
    return UNIT[unit].base;
  }

  costPerBase(i: Pick<Ingredient, 'packSize' | 'packUnit' | 'packPrice'>): number {
    return costPerBaseUnit(i);
  }

  lineCost(ing: Ingredient, line: RecipeLine): number | null {
    if (this.baseOf(line.unit) !== this.baseOf(ing.packUnit)) return null;
    return line.qty * UNIT[line.unit].factor * this.costPerBase(ing);
  }

  withProfit(cost: number, pct: number, mode: ProfitMode): number {
    return withProfit(cost, pct, mode);
  }

  roundUp(value: number, step: number): number {
    return roundUp(value, step);
  }

  quote(all: Ingredient[], lines: RecipeLine[], o: PriceInput): PriceQuote {
    const problems: string[] = [];

    const lineCosts = lines.map((line, n) => {
      const ing = all.find(a => a.id === line.ingredientId);
      if (!ing) return 0;
      const cost = this.lineCost(ing, line);
      if (cost === null) {
        problems.push(`Line ${n + 1}: ${ing.name.en} is bought in ${this.baseOf(ing.packUnit)}, not ${line.unit}.`);
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