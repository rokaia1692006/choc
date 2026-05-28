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
  detailedDescription?: string;     
  detailedDescriptionAr?: string;   
  price: number;
  image: string;         
  images?: string[];     
  category?: string;
  categoryAr?: string;
  categoryId?: number;
  badge?: string;
  badgeAr?: string;
  variants?: productTypes[];
  mixedBox?: Boxes | null;
}
export class ProductDetailModalComponent {
  product!: Product; 
  activeImage: string | null = null;
  setActiveImage(imgUrl: string): void {
    this.activeImage = imgUrl;
  }
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