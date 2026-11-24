import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { IngredientService } from '../../../core/services/Ingredient.service';
import { Ingredient } from '../../../core/models/Ingredient.model';
import { BoxContent, BoxSpec, Category, Product, ProductInput, ProductStatus, ProductType, ProfitMode, BoxMode } from '../../../core/models/product.model';
import { applyProfit, boxCost, finalPrice, productCost } from '@contracts/pricing';

const toLocal = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const toIso = (v: string) => new Date(v).toISOString();

type RecipeLineValue = { ingredientId: number; quantity: number };
type FixedContentValue = { bonbonId: number; pieces: number };

function availabilityRule(g: AbstractControl): ValidationErrors | null {
  const value = g.value as { availableFrom?: string | null; availableUntil?: string | null };
  const { availableFrom, availableUntil } = value;
  if (!availableFrom || !availableUntil) return null;
  return new Date(availableUntil) > new Date(availableFrom) ? null : { availabilityRange: true };
}

function boxRule(g: AbstractControl): ValidationErrors | null {
  const v = g.value as {
    type?: ProductType;
    recipe?: RecipeLineValue[];
    totalPieces?: number;
    rowSize?: number;
    boxMode?: BoxMode;
    fixedContents?: FixedContentValue[];
    allowedBonbonIds?: number[];
    sourceBarId?: number;
  };
  if (v.type === 'bar') return (v.sourceBarId ?? 0) > 0 ? null : { sourceBar: true };
  if (v.type !== 'box') return (v.recipe ?? []).length ? null : { recipeEmpty: true };
  if ((v.totalPieces ?? 0) < 1 || (v.rowSize ?? 0) < 1 || (v.totalPieces ?? 0) % (v.rowSize ?? 1) !== 0) return { boxRows: true };
  if (v.boxMode === 'fixed') {
    if (!(v.fixedContents ?? []).length) return { boxEmpty: true };
    const sum = (v.fixedContents ?? []).reduce((n, c) => n + (+(c['pieces'] as number | string) || 0), 0);
    return sum === (v.totalPieces ?? 0) ? null : { boxSum: true };
  }
  return (v.allowedBonbonIds ?? []).length >= 2 ? null : { mixedChoices: true };
}

@Component({ selector: 'app-product-form', imports: [ReactiveFormsModule, RouterLink], templateUrl: './product-form.html', styleUrl: './product-form.css' })
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(ProductService);
  private cats = inject(CategoryService);
  private ingredientApi = inject(IngredientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  categories = signal<Category[]>([]);
  ingredients = signal<Ingredient[]>([]);
  items = signal<Product[]>([]);
  gallery = signal<string[]>([]);
  needsReprice = signal(false);
  saving = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    type: 'box' as ProductType,
    status: 'active' as ProductStatus,
    name: this.fb.nonNullable.group({ en: ['', Validators.required], ar: '' }),
    description: this.fb.nonNullable.group({ en: ['', Validators.required], ar: '' }),
    details: this.fb.nonNullable.group({ en: '', ar: '' }),
    badge: this.fb.nonNullable.group({ en: '', ar: '' }),
    categoryId: 0,
    imageUrl: ['', Validators.required],
    availableFrom: '', availableUntil: '',
    sku: '', weightGrams: 0, shelfLifeDays: 0, stockQuantity: null as number | null,
    featured: false, sortOrder: 0,
    profitPercent: [40, [Validators.required, Validators.min(0), Validators.max(500)]],
    profitMode: 'markup' as ProfitMode,
    roundTo: 0.5,
    priceOverride: null as number | null,
    otherCost: [0, Validators.min(0)],
    recipe: this.fb.array<FormGroup>([]),
    boxMode: 'fixed' as BoxMode,
    totalPieces: 12, rowSize: 4, packagingCost: [0, Validators.min(0)],
    fixedContents: this.fb.array<FormGroup>([]),
    allowedBonbonIds: [[] as number[]],
    sourceBarId: [0, Validators.min(0)],
  }, { validators: [availabilityRule, boxRule] });

  get recipe() { return this.form.controls.recipe as FormArray<FormGroup>; }
  get fixedContents() { return this.form.controls.fixedContents as FormArray<FormGroup>; }
  get fixedTotal() { return this.fixedContents.controls.reduce((n, g) => n + (+g.value.pieces || 0), 0); }

  recipeGroup(r?: { ingredientId: number; quantity: number }) {
    return this.fb.nonNullable.group({
      ingredientId: [r?.ingredientId ?? 0, Validators.min(1)],
      quantity: [r?.quantity ?? 0, [Validators.required, Validators.min(0.0001)]],
    });
  }
  contentGroup(c?: BoxContent) {
    return this.fb.nonNullable.group({
      bonbonId: [c?.bonbonId ?? 0, Validators.min(1)],
      pieces: [c?.pieces ?? 1, [Validators.required, Validators.min(1)]],
    });
  }
  addRecipeLine() { this.recipe.push(this.recipeGroup()); }
  addContent() { this.fixedContents.push(this.contentGroup()); }

  unitOf(i: number): string {
    const id = +this.recipe.at(i).value.ingredientId;
    return this.ingredients().find(x => x.id === id)?.unit ?? '';
  }

  isAllowed(id: number): boolean {
    return this.form.controls.allowedBonbonIds.value.includes(id);
  }

  toggleAllowed(id: number) {
    const c = this.form.controls.allowedBonbonIds;
    c.setValue(c.value.includes(id) ? c.value.filter(x => x !== id) : [...c.value, id]);
  }

  private currentSpec(): BoxSpec {
    const v = this.form.getRawValue();
    const fixedContents = (v.fixedContents as Array<{ bonbonId: number | string; pieces: number | string }>) ?? [];
    return {
      mode: v.boxMode,
      totalPieces: +v.totalPieces,
      rowSize: +v.rowSize,
      packagingCost: +v.packagingCost || 0,
      fixedContents: fixedContents.map(c => ({ bonbonId: +c['bonbonId'], pieces: +c['pieces'] })),
      allowedBonbonIds: v.allowedBonbonIds,
    };
  }

  get cost(): number {
    const v = this.form.getRawValue();
    if (v.type === 'box') return boxCost(this.currentSpec(), this.items());
    const recipe = (v.recipe as Array<{ ingredientId: number | string; quantity: number | string }>).map(r => ({ ingredientId: +r['ingredientId'], quantity: +r['quantity'] || 0 }));
    return productCost({ recipe, otherCost: +v.otherCost || 0 }, this.ingredients());
  }

  get suggested(): number {
    const v = this.form.getRawValue();
    return applyProfit(this.cost, +v.profitPercent || 0, v.profitMode, +v.roundTo || 0).withProfit;
  }

  get selling(): number {
    return finalPrice(this.suggested, this.form.getRawValue().priceOverride);
  }

  ngOnInit() {
    this.cats.list().subscribe(c => this.categories.set(c));
    this.ingredientApi.list().subscribe({
      next: r => this.ingredients.set(r),
      error: () => this.error.set('Could not load ingredients. Reload the page.'),
    });
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id ? +id : null;
    this.svc.list().subscribe({
      next: all => this.items.set(all.filter(p => p.type !== 'box' && p.id !== this.id)),
      error: () => this.error.set('Could not load products. Reload the page.'),
    });
    if (!this.id) return;
    this.svc.get(this.id).subscribe({
      next: p => {
        p.recipe.forEach(r => this.recipe.push(this.recipeGroup(r)));
        p.box?.fixedContents.forEach(c => this.fixedContents.push(this.contentGroup(c)));
        this.gallery.set(p.galleryUrls);
        this.needsReprice.set(p.needsReprice);
        this.form.patchValue({
          type: p.type, status: p.status,
          name: p.name, description: p.description, details: p.details,
          badge: p.badge ?? { en: '', ar: '' },
          categoryId: p.categoryId ?? 0,
          imageUrl: p.imageUrl,
          availableFrom: toLocal(p.availability.from), availableUntil: toLocal(p.availability.until),
          sku: p.sku, weightGrams: p.weightGrams, shelfLifeDays: p.shelfLifeDays, stockQuantity: p.stockQuantity,
          featured: p.featured, sortOrder: p.sortOrder,
          profitPercent: p.profitPercent, profitMode: p.profitMode, roundTo: p.roundTo,
          priceOverride: p.priceOverride, otherCost: p.otherCost,
          boxMode: p.box?.mode ?? 'fixed', totalPieces: p.box?.totalPieces ?? 12, rowSize: p.box?.rowSize ?? 4,
          packagingCost: p.box?.packagingCost ?? 0, allowedBonbonIds: p.box?.allowedBonbonIds ?? [],
        });
      },
      error: () => this.error.set('Could not load this product.'),
    });
  }

  upload(e: Event, target: 'image' | 'gallery') {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5_000_000) {
      this.error.set('Upload failed. Use a JPG, PNG or WebP under 5 MB.');
      input.value = '';
      return;
    }
    this.svc.upload(file).subscribe({
      next: r => {
        if (target === 'image') this.form.controls.imageUrl.setValue(r.url);
        else this.gallery.update(g => [...g, r.url].slice(0, 8));
        input.value = '';
      },
      error: () => this.error.set('Upload failed. Use a JPG, PNG or WebP under 5 MB.'),
    });
  }

  removeGallery(i: number) {
    this.gallery.update(g => g.filter((_, n) => n !== i));
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const isBox = v.type === 'box';
    const body: ProductInput = {
      type: v.type,
      sellIndividually: v.type === 'bar',
      name: v.name,
      description: v.description,
      details: v.details,
      imageUrl: v.imageUrl,
      galleryUrls: this.gallery(),
      categoryId: v.categoryId > 0 ? v.categoryId : null,
      badge: v.badge.en || v.badge.ar ? v.badge : null,
      status: v.status,
      availability: {
        from: v.availableFrom ? toIso(v.availableFrom) : null,
        until: v.availableUntil ? toIso(v.availableUntil) : null,
      },
      sku: v.sku,
      weightGrams: +v.weightGrams || 0,
      shelfLifeDays: +v.shelfLifeDays || 0,
      stockQuantity: v.stockQuantity,
      featured: v.featured,
      sortOrder: +v.sortOrder || 0,
      profitPercent: +v.profitPercent,
      profitMode: v.profitMode,
      roundTo: +v.roundTo || 0,
      priceOverride: v.priceOverride && v.priceOverride > 0 ? v.priceOverride : null,
      otherCost: isBox ? 0 : +v.otherCost || 0,
      recipe: isBox ? [] : (v.recipe as Array<{ ingredientId: number | string; quantity: number | string }>).map(r => ({ ingredientId: +r['ingredientId'], quantity: +r['quantity'] })),
      box: isBox ? this.currentSpec() : null,
      sourceBarId: v.type === 'bar' ? +v.sourceBarId : null,
    };
    this.saving.set(true); this.error.set('');
    const req = this.id ? this.svc.update(this.id, body) : this.svc.create(body);
    req.subscribe({ next: () => this.router.navigate(['/products']), error: () => { this.saving.set(false); this.error.set('Could not save the product. Check the fields and try again.'); } });
  }
}