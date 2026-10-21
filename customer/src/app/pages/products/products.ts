import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProductCards } from '../../shared/components/product-cards/product-cards';
import { Product } from '../../core/models/products';
import { CurrencyService } from '../../core/services/currency';
import { LanguageService } from '../../core/services/language';
import { LanguagesPipe } from '../../shared/pipes/languages-pipe';
import { CurrencyPipe } from '../../shared/pipes/currency-pipe';
import { CategoryService } from '../../core/services/category';
import { Category } from '../../core/models/products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ProductCards, LanguagesPipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  searchQuery = signal('');
  
  sortBy = signal('default');
  currency = inject(CurrencyService);
  lang = inject(LanguageService);
  categoryService = inject(CategoryService);
selectedCategory = signal<number>(0);
allProducts: Product[] = [
  { id: 1, name: 'Dark Truffle Box', nameAr: 'صندوق الترافل الداكن',
     detailedDescription: 'Our Dark Truffle Box is crafted from single-origin 70% cacao sourced from Ecuador. Each truffle is hand-rolled and filled with a slow-roasted hazelnut praline, finished with a dusting of Dutch cocoa powder. Stored in a hand-folded gift box lined with gold tissue. Makes 12 pieces.',
  detailedDescriptionAr: 'صندوق الترافل الداكن مصنوع من كاكاو ٧٠٪ أحادي المصدر من الإكوادور. كل قطعة مدحرجة يدوياً ومحشوة ببرالين البندق المحمص ببطء، مع لمسة من مسحوق الكاكاو الهولندي. يُقدَّم في صندوق هدايا مطوي يدوياً مبطّن بورق ذهبي. يحتوي على ١٢ قطعة.',
 description: 'Rich 70% cacao with hazelnut praline filling.', descriptionAr: 'شوكولاتة داكنة فاخرة ٧٠٪ كاكاو مع حشوة البندق.', price: 120, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', categoryId: 1, badge: 'Bestseller', badgeAr: 'الأكثر مبيعاً' },
  { id: 2, name: 'Salted Caramel', nameAr: 'كراميل مملح', description: 'Smooth milk chocolate with sea salt caramel.', descriptionAr: 'شوكولاتة حليب ناعمة مع كراميل ملح البحر.', price: 85, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', categoryId: 2, badge: 'New', badgeAr: 'جديد' },
  { id: 3, name: 'Gift Collection', nameAr: 'مجموعة هدايا', description: 'Assorted premium bonbons, 24 pieces.', descriptionAr: 'بونبون فاخر متنوع، ٢٤ قطعة.', price: 250, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', categoryId: 3 },
  { id: 4, name: 'White Raspberry', nameAr: 'شوكولاتة بيضاء بالتوت', description: 'Delicate white chocolate with raspberry ganache.', descriptionAr: 'شوكولاتة بيضاء رقيقة مع جاناش التوت.', price: 95, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', categoryId: 3 },
  { id: 5, name: 'Hazelnut Praline', nameAr: 'برالين البندق', description: 'Classic praline wrapped in dark chocolate.', descriptionAr: 'برالين كلاسيكي مغلف بالشوكولاتة الداكنة.', price: 110, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', categoryId: 5 },
  { id: 6, name: 'Matcha Green', nameAr: 'ماتشا أخضر', description: 'Japanese matcha infused in creamy milk chocolate.', descriptionAr: 'ماتشا ياباني ممزوج بشوكولاتة حليب كريمية.', price: 100, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', categoryId: 6 },
  { id: 7, name: 'Milk Chocolate Bar', nameAr: 'لوح شوكولاتة حليب', description: 'Classic creamy milk chocolate, 100g.', descriptionAr: 'شوكولاتة حليب كريمية كلاسيكية، ١٠٠ جرام.', price: 60, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', categoryId: 1 },
  { id: 8, name: 'Rose & Pistachio', nameAr: 'ورد وفستق', description: 'Middle eastern inspired rose water and pistachio.', descriptionAr: 'مستوحى من الشرق الأوسط بماء الورد والفستق.', price: 130, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', categoryId: 6, badge: 'New', badgeAr: 'جديد' },
  { id: 9, name: 'Caramel Dream Box', nameAr: 'صندوق كراميل الأحلام', description: '12 pieces of assorted caramel bonbons.', descriptionAr: '١٢ قطعة بونبون كراميل متنوعة.', price: 145, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', categoryId: 2 },
  {
    id: 10, name: 'Premium Mixed Box', nameAr: 'صندوق مميز متنوع',
    description: 'Build your own 24-piece box with your favourite flavours.', descriptionAr: 'صمّم صندوقك الخاص من ٢٤ قطعة بنكهاتك المفضلة.',
    price: 220, categoryId: 3, badge: 'Customise', badgeAr: 'خصّص',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images',
    mixedBox: {
      totalPieces: 24, minPerFlavour: 0,
      flavours: [
        { id: '1', flavour: 'kunafa pistachio', flavourAr: 'كنافة بالفستق', label: 'Kunafa Pistachio', labelAr: 'كنافة بالفستق', priceModifier: 0, crossSectionImage: '', available: true },
        { id: '2', flavour: 'caramel', flavourAr: 'كراميل', label: 'Caramel', labelAr: 'كراميل', priceModifier: 0, crossSectionImage: '', available: true },
        { id: '3', flavour: 'white', flavourAr: 'شوكولاتة بيضاء', label: 'White Chocolate', labelAr: 'شوكولاتة بيضاء', priceModifier: 0, crossSectionImage: '', available: true },
        { id: '4', flavour: 'caramel', flavourAr: 'كراميل مملح', label: 'Salted Caramel', labelAr: 'كراميل مملح', priceModifier: 0, crossSectionImage: '', available: true },
      ]
    }
  },
  {
    id: 11, name: 'Artisan Chocolate Bar', nameAr: 'لوح شوكولاتة حرفي',
    description: 'Our premium single-origin chocolate shell customizable with custom artisan fillings.', descriptionAr: 'قشرة شوكولاتة فاخرة من مصدر واحد مع حشوات حرفية مخصصة.',
    price: 130, categoryId: 6, badge: 'Flavours', badgeAr: 'نكهات',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images',
    mixedBox: null,
    variants: [
      { id: '101', flavour: 'ganache', flavourAr: 'جاناش', label: 'Classic Ganache', labelAr: 'جاناش كلاسيك', available: true, priceModifier: 0, crossSectionImage: '' },
      { id: '102', flavour: 'caramel', flavourAr: 'كراميل مملح', label: 'Sea Salt Caramel', labelAr: 'كراميل بملح البحر', available: true, priceModifier: 15, crossSectionImage: '' },
      { id: '103', flavour: 'kunafa pistachio', flavourAr: 'كنافة بالفستق', label: 'Kunafa Pistachio', labelAr: 'كنافة بالفستق', available: true, priceModifier: 30, crossSectionImage: '' },
      { id: '104', flavour: 'almond', flavourAr: 'لوز', label: 'Roasted Almond', labelAr: 'لوز محمص', available: true, priceModifier: 10, crossSectionImage: '' },
      { id: '105', flavour: 'coffee', flavourAr: 'قهوة', label: 'Velvety Espresso', labelAr: 'إسبريسو ناعم', available: false, priceModifier: 10, crossSectionImage: '' },
    ]
  },
  {
    id: 12, name: 'Classic Assorted Box', nameAr: 'صندوق كلاسيك متنوع',
    description: 'A curated selection of our most beloved flavours in one elegant box.', descriptionAr: 'تشكيلة مختارة من أشهر نكهاتنا في صندوق أنيق واحد.',
    price: 180, categoryId: 3, badge: 'Bestseller', badgeAr: 'الأكثر مبيعاً',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images',
    mixedBox: {
      totalPieces: 16, minPerFlavour: 0,
      flavours: [
        { id: 'b1', flavour: 'kunafa pistachio', flavourAr: 'كنافة بالفستق', label: 'Kunafa Pistachio', labelAr: 'كنافة بالفستق', priceModifier: 0, crossSectionImage: '', available: true },
        { id: 'b2', flavour: 'caramel', flavourAr: 'كراميل مملح', label: 'Salted Caramel', labelAr: 'كراميل مملح', priceModifier: 0, crossSectionImage: '', available: true },
        { id: 'b3', flavour: 'ganache', flavourAr: 'جاناش', label: 'Classic Ganache', labelAr: 'جاناش كلاسيك', priceModifier: 0, crossSectionImage: '', available: true },
        { id: 'b4', flavour: 'white', flavourAr: 'شوكولاتة بيضاء', label: 'White Chocolate', labelAr: 'شوكولاتة بيضاء', priceModifier: 0, crossSectionImage: '', available: true },
        { id: 'b5', flavour: 'almond', flavourAr: 'لوز محمص', label: 'Roasted Almond', labelAr: 'لوز محمص', priceModifier: 0, crossSectionImage: '', available: true },
        { id: 'b6', flavour: 'coffee', flavourAr: 'إسبريسو', label: 'Velvety Espresso', labelAr: 'إسبريسو ناعم', priceModifier: 0, crossSectionImage: '', available: false },
      ]
    }
  },
];

filteredProducts = computed(() => {
  let products = this.allProducts.map(p => ({
    ...p,
    baseNameEn: (p as any).baseNameEn || p.name,
    baseNameAr: (p as any).baseNameAr || p.nameAr || p.name
  }));

  if (this.selectedCategory() !== 0) {
    products = products.filter(p => p.categoryId === this.selectedCategory());
  }

  if (this.searchQuery().trim()) {
    const q = this.searchQuery().toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  switch (this.sortBy()) {
    case 'price-asc': return [...products].sort((a, b) => a.price - b.price);
    case 'price-desc': return [...products].sort((a, b) => b.price - a.price);
    case 'name': return [...products].sort((a, b) => a.name.localeCompare(b.name));
    default: return products;
  }
});
displayCategory(cat: Category): string {
  return this.lang.isArabic() ? cat.nameAr : cat.name;
}
setCategory(id: number) { this.selectedCategory.set(id); }
  setSort(event: Event) { this.sortBy.set((event.target as HTMLSelectElement).value); }
  setSearch(event: Event) { this.searchQuery.set((event.target as HTMLInputElement).value); }
}