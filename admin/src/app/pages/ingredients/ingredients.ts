import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Ingredient, IngredientInput, PACK_UNITS } from '../../core/models/Ingredient.model';
import { IngredientService } from '../../core/services/Ingredient.service';
import { PricingService } from '../../core/services/pricing.service';
import { ErrorLine } from '../../shared/components/error-line/error-line';

const blank = (): IngredientInput => ({
  name: { en: '', ar: '' }, packSize: 1000, packUnit: 'g', packPrice: 0, allergens: [], supplier: '',
});
const valid = (i: IngredientInput) => i.name.en.trim().length > 0 && i.packSize > 0 && i.packPrice >= 0;

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
  draft: IngredientInput = blank();

  ngOnInit() {
    this.load();
  }

  perUnit(i: IngredientInput): string {
    const c = this.pricing.costPerBase(i);
    return c > 0 ? `${c.toFixed(4)} ${this.pricing.currency} per ${this.pricing.baseOf(i.packUnit)}` : '';
  }

  allergensText(i: IngredientInput): string {
    return i.allergens.join(', ');
  }

  setAllergens(i: IngredientInput, value: string) {
    i.allergens = value.split(',').map(a => a.trim()).filter(Boolean);
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
        this.rows.update(x => [...x, made].sort((a, b) => a.name.en.localeCompare(b.name.en)));
        this.draft = blank();
        this.error.set('');
      },
      error: error => this.error.set(this.addErrorMessage(error)),
    });
  }

  private addErrorMessage(error: HttpErrorResponse): string {
    const message = typeof error.error?.message === 'string' ? error.error.message : '';
    if (error.status === 400) return message || 'Check the ingredient name, unit, pack size, and price.';
    if (error.status === 401) return 'Your admin session expired. Sign in again and retry.';
    if (error.status === 403) return 'This account cannot manage ingredients. Sign in with an admin account.';
    if (error.status === 409) return message || 'That ingredient conflicts with existing data.';
    if (error.status === 404) return 'The running API does not have the ingredient endpoint. Restart the backend and confirm it is running on port 5297.';
    if (error.status === 0) return 'Could not reach the API. Check that the backend is running and allows this site.';
    if (error.status >= 500) return 'The server could not save the ingredient. Restart the API to apply the latest database migration, then retry.';
    return message || 'Could not add that ingredient. Check the API response and retry.';
  }

  save(r: Ingredient) {
    if (!valid(r)) {
      this.error.set('An ingredient needs a name and a pack size above zero.');
      return;
    }
    this.api.update(r).subscribe({
      next: () => this.error.set(''),
      error: () => this.error.set(`Could not save ${r.name.en}. Reload to see the stored values.`),
    });
  }

  remove(r: Ingredient) {
    if (!confirm(`Delete ${r.name.en}? Recipes that use it will need another ingredient.`)) return;
    this.api.remove(r.id).subscribe({
      next: () => this.rows.update(x => x.filter(y => y.id !== r.id)),
      error: () => this.error.set(`Could not delete ${r.name.en}. It may still be used in a product.`),
    });
  }
}