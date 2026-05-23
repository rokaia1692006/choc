import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProductCards } from '../../shared/components/product-cards/product-cards';
import { Product } from '../../core/models/products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ProductCards],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  searchQuery = signal('');
  selectedCategory = signal('All');
  sortBy = signal('default');

  categories = ['All', 'Truffles', 'Caramel', 'Gifts', 'White', 'Praline', 'Special'];

  allProducts: Product[] = [
    { id: 1, name: 'Dark Truffle Box', description: 'Rich 70% cacao with hazelnut praline filling.', price: 120, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', category: 'Truffles', badge: 'Bestseller' },
    { id: 2, name: 'Salted Caramel', description: 'Smooth milk chocolate with sea salt caramel.', price: 85, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', category: 'Caramel', badge: 'New' },
    { id: 3, name: 'Gift Collection', description: 'Assorted premium bonbons, 24 pieces.', price: 250, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', category: 'Gifts' },
    { id: 4, name: 'White Raspberry', description: 'Delicate white chocolate with raspberry ganache.', price: 95, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', category: 'White' },
    { id: 5, name: 'Hazelnut Praline', description: 'Classic praline wrapped in dark chocolate.', price: 110, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', category: 'Praline' },
    { id: 6, name: 'Matcha Green', description: 'Japanese matcha infused in creamy milk chocolate.', price: 100, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', category: 'Special' },
    { id: 7, name: 'Milk Chocolate Bar', description: 'Classic creamy milk chocolate, 100g.', price: 60, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', category: 'Truffles' },
    { id: 8, name: 'Rose & Pistachio', description: 'Middle eastern inspired rose water and pistachio.', price: 130, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', category: 'Special', badge: 'New' },
    { id: 9, name: 'Caramel Dream Box', description: '12 pieces of assorted caramel bonbons.', price: 145, image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images', category: 'Caramel' },
    
    {
      id: 10,
      name: 'Premium Mixed Box',
      description: 'Build your own 24-piece box with your favourite flavours.',
      price: 220,
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.njRD6k_795CrG6AVtCi_QQHaDy%3Fpid%3DApi&f=1&ipt=466d39f76c82df66c454922d5279fbc12db74beff78ccdbd89394b1c05f016fb&ipo=images',
      category: 'Gifts',
      badge: 'Customise',
      mixedBox: {
        totalPieces: 24,
        minPerFlavour: 0,
        flavours: [
          { id: '1', flavour: 'kunafa pistachio', label: 'Kunafa Pistachio', priceModifier: 0, crossSectionImage: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', available: true },
          { id: '2', flavour: 'caramel', label: 'Caramel', priceModifier: 0, crossSectionImage: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', available: true },
          { id: '3', flavour: 'white', label: 'White Chocolate', priceModifier: 0, crossSectionImage: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', available: true },
          { id: '4', flavour: 'caramel', label: 'Salted Caramel', priceModifier: 0, crossSectionImage: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images', available: true },
        ]
      }
    },

    
   {
      id: 11,
      name: 'Artisan Chocolate Bar',
      description: 'Our premium single-origin chocolate shell customizable with custom artisan fillings.',
      price: 130,
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.1zHspPS9X-Ayi2ms8DMNZAHaHa%3Fpid%3DApi&f=1&ipt=0a0e0040f310351993de98221e6e23992fa9f70773f5c5b9ddb71e6c0204e6cf&ipo=images',
      category: 'Special',
      badge: 'Flavours',
      mixedBox: null,
      variants: [
        { id: '101', label: 'Classic Ganache', flavour: 'ganache', available: true, priceModifier: 0, crossSectionImage: '' },
        { id: '102', label: 'Sea Salt Caramel', flavour: 'caramel', available: true, priceModifier: 15, crossSectionImage: '' },
        { id: '103', label: 'Kunafa Pistachio', flavour: 'kunafa pistachio', available: true, priceModifier: 30, crossSectionImage: '' },
        { id: '104', label: 'Roasted Almond', flavour: 'almond', available: true, priceModifier: 10, crossSectionImage: '' },
        { id: '105', label: 'Velvety Espresso', flavour: 'coffee', available: false, priceModifier: 10, crossSectionImage: '' },
        { id: '106', label: 'Dreamy White', flavour: 'white', available: true, priceModifier: 0, crossSectionImage: '' }
      ]
    }
  ];

  filteredProducts = computed(() => {
    let products = this.allProducts;

    if (this.selectedCategory() !== 'All') {
      products = products.filter(p => p.category === this.selectedCategory());
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

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  setSort(event: Event) {
    this.sortBy.set((event.target as HTMLSelectElement).value);
  }

  setSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}