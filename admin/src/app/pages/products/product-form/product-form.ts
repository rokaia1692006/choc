import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { BoxItem, BoxType, Category, Product, ProductInput, ProductVariant } from '../../../core/models/product.model';

const toLocal = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const toIso = (v: string) => new Date(v).toISOString();

function seasonRule(g: AbstractControl): ValidationErrors | null {
  if (!g.get('isSeasonal')?.value) return null;
  const { seasonName, startsAt, endsAt } = g.value;
  if (!seasonName || !startsAt || !endsAt) return { seasonMissing: true };
  return new Date(endsAt) > new Date(startsAt) ? null : { seasonRange: true };
}

function boxRule(g: AbstractControl): ValidationErrors | null {
  const v = g.value;
  if (v.boxType === 'set') return v.contents.length ? null : { setEmpty: true };
  if (v.boxType !== 'mixed') return null;
  const flavours = (v.variants as { available: boolean }[]).filter(x => x.available).length;
  if (flavours < 2) return { mixedFlavours: true };
  if (!(v.totalPieces >= 1) || v.minPerFlavour * flavours > v.totalPieces) return { mixedPieces: true };
  return null;
}

@Component({ selector: 'app-product-form', imports: [ReactiveFormsModule, RouterLink], templateUrl: './product-form.html', styleUrl: './product-form.css' })
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(ProductService);
  private cats = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  categories = signal<Category[]>([]);
  saving = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    status: 'draft' as Product['status'],
    name: ['', Validators.required], nameAr: '',
    description: ['', Validators.required], descriptionAr: '',
    detailedDescription: '', detailedDescriptionAr: '',
    price: [0, [Validators.required, Validators.min(0)]],
    categoryId: [0, Validators.min(1)],
    badge: '', badgeAr: '',
    image: ['', Validators.required],
    boxType: 'single' as BoxType,
    contents: this.fb.array<FormGroup>([]),
    totalPieces: 12, minPerFlavour: 0, boxLabel: '', boxLabelAr: '',
    variantLabel: '',
    variants: this.fb.array<FormGroup>([]),
    isSeasonal: false, seasonName: '', seasonNameAr: '', startsAt: '', endsAt: '',
    sku: '', ingredients: '', ingredientsAr: '', allergens: '',
    weightGrams: 0, shelfLifeDays: 0, stockQuantity: null as number | null,
    featured: false, sortOrder: 0,
  }, { validators: [seasonRule, boxRule] });

  get variants() { return this.form.controls.variants as FormArray<FormGroup>; }
  get contents() { return this.form.controls.contents as FormArray<FormGroup>; }
  get setTotal() { return this.contents.controls.reduce((n, g) => n + (+g.value.quantity || 0), 0); }

  variantGroup(v?: ProductVariant) {
    return this.fb.nonNullable.group({
      id: v?.id ?? crypto.randomUUID(), flavour: [v?.flavour ?? '', Validators.required], flavourAr: v?.flavourAr ?? '',
      label: [v?.label ?? '', Validators.required], labelAr: v?.labelAr ?? '',
      priceModifier: v?.priceModifier ?? 0, crossSectionImage: v?.crossSectionImage ?? '', available: v?.available ?? true,
    });
  }
  contentGroup(i?: BoxItem) {
    return this.fb.nonNullable.group({ flavour: [i?.flavour ?? '', Validators.required], flavourAr: i?.flavourAr ?? '', quantity: [i?.quantity ?? 1, [Validators.required, Validators.min(1)]] });
  }
  addVariant() { this.variants.push(this.variantGroup()); }
  addContent() { this.contents.push(this.contentGroup()); }

  ngOnInit() {
    this.cats.list().subscribe(c => this.categories.set(c));
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.id = +id;
    this.svc.get(this.id).subscribe({
      next: p => {
        p.variants?.forEach(v => this.variants.push(this.variantGroup(v)));
        p.boxContents?.forEach(i => this.contents.push(this.contentGroup(i)));
        this.form.patchValue({
          ...p, allergens: (p.allergens ?? []).join(', '),
          boxType: p.boxType ?? 'single',
          totalPieces: p.mixedBox?.totalPieces ?? 12, minPerFlavour: p.mixedBox?.minPerFlavour ?? 0,
          boxLabel: p.mixedBox?.label ?? '', boxLabelAr: p.mixedBox?.labelAr ?? '',
          seasonName: p.seasonal?.seasonName ?? '', seasonNameAr: p.seasonal?.seasonNameAr ?? '',
          startsAt: toLocal(p.seasonal?.startsAt), endsAt: toLocal(p.seasonal?.endsAt),
          variants: undefined, contents: undefined,
        } as any);
      },
      error: () => this.error.set('Could not load this product.'),
    });
  }

  upload(e: Event, target: 'image' | number) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.svc.upload(file).subscribe({
      next: r => target === 'image' ? this.form.controls.image.setValue(r.url) : this.variants.at(target).patchValue({ crossSectionImage: r.url }),
      error: () => this.error.set('Upload failed. Use a JPG, PNG or WebP under 5 MB.'),
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const { seasonName, seasonNameAr, startsAt, endsAt, allergens, contents, totalPieces, minPerFlavour, boxLabel, boxLabelAr, ...rest } = v;
    const body = {
      ...rest,
      variants: v.boxType === 'set' ? [] : rest.variants,
      boxContents: v.boxType === 'set' ? contents : [],
      mixedBox: v.boxType === 'mixed' ? { totalPieces, minPerFlavour, label: boxLabel, labelAr: boxLabelAr } : null,
      allergens: allergens.split(',').map(a => a.trim()).filter(Boolean),
      seasonal: v.isSeasonal ? { seasonName, seasonNameAr, startsAt: toIso(startsAt), endsAt: toIso(endsAt) } : null,
    } as unknown as ProductInput;
    this.saving.set(true); this.error.set('');
    const req = this.id ? this.svc.update(this.id, body) : this.svc.create(body);
    req.subscribe({ next: () => this.router.navigate(['/products']), error: () => { this.saving.set(false); this.error.set('Could not save the product. Check the fields and try again.'); } });
  }
}
