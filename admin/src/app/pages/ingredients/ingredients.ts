import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ingredient, PACK_UNITS } from '../../core/models/Ingredient.model';
import { IngredientService } from '../../core/services/Ingredient.service';
import { PricingService } from '../../core/services/pricing.service';
import { ErrorLine } from '../../shared/components/error-line/error-line';

const blank = (): Ingredient => ({
  name: '', packSize: 1000, packUnit: 'g', packPrice: 0, allergens: '', supplier: '',
});
const valid = (i: Ingredient) => i.name.trim().length > 0 && i.packSize > 0 && i.packPrice >= 0;

@Component({
  selector: 'app-ingredients',
  imports: [FormsModule, ErrorLine],
  templateUrl: './ingredients.html',
  styleUrl: './ingredients.css',
})
export class IngredientsPage implements OnInit {
  private api = inject(IngredientService);
  private pricing = inject(PricingService);

  units = PACK_UNITS;
  rows = signal<Ingredient[]>([]);
  error = signal('');
  draft: Ingredient = blank();

  ngOnInit() {
    this.load();
  }

  perUnit(i: Ingredient): string {
    const c = this.pricing.costPerBase(i);
    return c > 0 ? `${c.toFixed(4)} ${this.pricing.currency} per ${this.pricing.baseOf(i.packUnit)}` : '';
  }

  load() {
    this.api.list().subscribe({
      next: r => this.rows.set(r),
      error: () => this.error.set('Could not load ingredients. Check the connection and reload.'),
    });
  }

  add() {
    if (!valid(this.draft)) {
      this.error.set('Name and pack size are required.');
      return;
    }
    this.api.create(this.draft).subscribe({
      next: made => {
        this.rows.update(x => [...x, made].sort((a, b) => a.name.localeCompare(b.name)));
        this.draft = blank();
        this.error.set('');
      },
      error: () => this.error.set('Could not add that ingredient. Nothing was saved.'),
    });
  }

  save(r: Ingredient) {
    if (!valid(r)) {
      this.error.set('An ingredient needs a name and a pack size above zero.');
      return;
    }
    this.api.update(r).subscribe({
      next: () => this.error.set(''),
      error: () => this.error.set(`Could not save ${r.name}. Reload to see the stored values.`),
    });
  }

  remove(r: Ingredient) {
    if (!confirm(`Delete ${r.name}? Recipes that use it will need another ingredient.`)) return;
    this.api.remove(r.id!).subscribe({
      next: () => this.rows.update(x => x.filter(y => y.id !== r.id)),
      error: () => this.error.set(`Could not delete ${r.name}. It may still be used in a product.`),
    });
  }
}