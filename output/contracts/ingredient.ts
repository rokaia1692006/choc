import { LocalizedText } from './Localized';

export type IngredientUnit = 'g' | 'ml' | 'piece';
export interface Ingredient {
  id: number;
  name: LocalizedText;
  unit: IngredientUnit;
  costPerUnit: number;
}

export type IngredientInput = Omit<Ingredient, 'id'>;