export interface Category {
  id: number;
  name: string;
  nameAr: string;
}

export interface Product {
  id: number;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  image: string;
  category?: string;
  categoryAr?: string;
  categoryId?: number;
  badge?: string;
  badgeAr?: string;
  variants?: productTypes[];
  mixedBox?: Boxes | null;
}
export interface Boxes {
  totalPieces: number;
  minPerFlavour: number;
  flavours: productTypes[];
  label?: string;
  labelAr?: string;
}
export interface productTypes {
  id: string;      
  flavour: 'kunafa pistachio' | 'caramel' | 'coffee' | 'ganache' | 'almond' | 'white';
  flavourAr?: string;
  label: string;
  labelAr?: string;
  priceModifier: number;
  crossSectionImage: string;
  available: boolean;
}