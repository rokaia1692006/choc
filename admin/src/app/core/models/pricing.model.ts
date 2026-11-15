import { ProfitMode } from '@contracts/product';

export type { ProfitMode };

export interface PriceInput {
  yieldPieces: number;
  wastePct: number;
  packagingCost: number;
  labourCost: number;
  profitPct: number;
  profitMode: ProfitMode;
  roundTo: number;
}

export interface PriceQuote {
  lineCosts: number[];
  ingredientsCost: number;
  batchCost: number;
  costPerPiece: number;
  profitAdded: number;
  suggested: number;
  problems: string[];
}