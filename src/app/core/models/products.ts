export interface productTypes {
  id: string;
  flavour: 'kunafa pistachio' | 'caramel' | 'coffee' | 'ganache' | 'almond' | 'white';
  label: string;
  priceModifier: number;
  crossSectionImage: string;
  available: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
  variants?: productTypes[];
  mixedBox?: Boxes|null;
}

export interface Boxes {
  totalPieces: number;       
  minPerFlavour: number;     
  flavours: productTypes[];
}