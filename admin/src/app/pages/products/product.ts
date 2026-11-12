import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Ingredient, PACK_UNITS, PackUnit, RecipeProductDraft } from '../../core/models/Ingredient.model';
import { PriceQuote } from '../../core/models/pricing.model';
import { IngredientService } from '../../core/services/Ingredient.service';
import { PricingService } from '../../core/services/pricing.service';
import { ErrorLine } from '../../shared/components/error-line/error-line';
import { MoneyPipe } from '../../shared/pipes/money-pipe';

@Component({
  selector: 'app-product-builder',
  imports: [FormsModule, ErrorLine, MoneyPipe],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductPage implements OnInit {
  private api = inject(IngredientService);
  private router = inject(Router);
  private pricing = inject(PricingService);

  cur = this.pricing.currency;
  ingredients = signal<Ingredient[]>([]);
  saving = signal(false);
  error = signal('');

  d: RecipeProductDraft = {
    name: '', description: '', yieldPieces: 12, wastePct: 3, packagingCost: 0, labourCost: 0,
    profitPct: 40, profitMode: 'markup', roundTo: 0.5, priceOverride: null,
    lines: [{ ingredientId: null, qty: 0, unit: 'g' }],
  };

  ngOnInit() {
    this.api.list().subscribe({
      next: r => this.ingredients.set(r),
      error: () => this.error.set('Could not load ingredients. Reload the page.'),
    });
  }

  get q(): PriceQuote {
    return this.pricing.quote(this.ingredients(), this.d.lines, this.d);
  }

  get selling(): number {
    return this.pricing.sellingPrice(this.q, this.d.priceOverride);
  }

  get profitEach(): number {
    return this.selling - this.q.costPerPiece;
  }

  get profitOfPrice(): number {
    return this.selling > 0 ? (this.profitEach / this.selling) * 100 : 0;
  }

  get profitHint(): string {
    return this.d.profitMode === 'markup'
      ? 'The price is the cost plus this percent of the cost.'
      : 'This percent of the selling price is profit.';
  }

  get canSave(): boolean {
    return this.d.name.trim().length > 0
      && this.q.problems.length === 0
      && this.d.lines.some(l => l.ingredientId !== null && l.qty > 0);
  }

  addLine() {
    this.d.lines.push({ ingredientId: null, qty: 0, unit: 'g' });
  }

  removeLine(n: number) {
    this.d.lines.splice(n, 1);
    if (this.d.lines.length === 0) this.addLine();
  }

  unitsFor(id: number | null): PackUnit[] {
    const ing = this.ingredients().find(i => i.id === id);
    return ing ? PACK_UNITS.filter(u => this.pricing.baseOf(u) === this.pricing.baseOf(ing.packUnit)) : PACK_UNITS;
  }

  picked(n: number) {
    const line = this.d.lines[n];
    const ing = this.ingredients().find(i => i.id === line.ingredientId);
    if (ing && this.pricing.baseOf(line.unit) !== this.pricing.baseOf(ing.packUnit)) line.unit = ing.packUnit;
  }

  save() {
    this.saving.set(true);
    const body: RecipeProductDraft = {
      ...this.d,
      lines: this.d.lines.filter(l => l.ingredientId !== null && l.qty > 0),
    };
    this.api.createProductFromRecipe(body).subscribe({
      next: made => this.router.navigate(['/products', made.id, 'edit']),
      error: () => {
        this.saving.set(false);
        this.error.set('The product was not created. Check the recipe and try again.');
      },
    });
  }
}