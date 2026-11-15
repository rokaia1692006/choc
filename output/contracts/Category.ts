import { LocalizedText } from './Localized';

export interface Category {
  id: number;
  name: LocalizedText;
  sortOrder: number;
  isActive: boolean;
}